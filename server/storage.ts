import { 
  type User, 
  type InsertUser,
  type Conversation,
  type InsertConversation,
  type CareerRecommendation,
  type InsertCareerRecommendation,
  type ChatMessage,
  type AssessmentData,
  users,
  conversations,
  careerRecommendations
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(sessionId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserAssessment(sessionId: string, assessmentData: AssessmentData): Promise<User>;

  // Conversation methods
  getConversation(sessionId: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(sessionId: string, messages: ChatMessage[]): Promise<Conversation>;

  // Career recommendation methods
  getCareerRecommendations(sessionId: string): Promise<CareerRecommendation[]>;
  createCareerRecommendation(recommendation: InsertCareerRecommendation): Promise<CareerRecommendation>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private conversations: Map<string, Conversation>;
  private careerRecommendations: Map<string, CareerRecommendation>;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.careerRecommendations = new Map();
  }

  async getUser(sessionId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.sessionId === sessionId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      assessmentData: insertUser.assessmentData || null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserAssessment(sessionId: string, assessmentData: AssessmentData): Promise<User> {
    const existingUser = await this.getUser(sessionId);
    if (existingUser) {
      existingUser.assessmentData = assessmentData as any;
      this.users.set(existingUser.id, existingUser);
      return existingUser;
    }
    
    // Create new user if doesn't exist
    return this.createUser({
      sessionId,
      assessmentData: assessmentData as any,
    });
  }

  async getConversation(sessionId: string): Promise<Conversation | undefined> {
    return Array.from(this.conversations.values()).find(conv => conv.sessionId === sessionId);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: insertConversation.messages || [],
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(sessionId: string, messages: ChatMessage[]): Promise<Conversation> {
    const existing = await this.getConversation(sessionId);
    if (existing) {
      existing.messages = messages as any;
      existing.updatedAt = new Date();
      this.conversations.set(existing.id, existing);
      return existing;
    }
    
    return this.createConversation({
      sessionId,
      messages: messages as any,
    });
  }

  async getCareerRecommendations(sessionId: string): Promise<CareerRecommendation[]> {
    return Array.from(this.careerRecommendations.values())
      .filter(rec => rec.sessionId === sessionId);
  }

  async createCareerRecommendation(insertRecommendation: InsertCareerRecommendation): Promise<CareerRecommendation> {
    const id = randomUUID();
    const recommendation: CareerRecommendation = {
      ...insertRecommendation,
      id,
      createdAt: new Date(),
    };
    this.careerRecommendations.set(id, recommendation);
    return recommendation;
  }
}

// Database storage implementation
class DatabaseStorage implements IStorage {
  private db: any;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required for database storage");
    }
    
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  async getUser(sessionId: string): Promise<User | undefined> {
    try {
      const result = await this.db
        .select()
        .from(users)
        .where(eq(users.sessionId, sessionId))
        .limit(1);
      
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const result = await this.db
        .insert(users)
        .values(insertUser)
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUserAssessment(sessionId: string, assessmentData: AssessmentData): Promise<User> {
    try {
      const result = await this.db
        .update(users)
        .set({ assessmentData: assessmentData as any })
        .where(eq(users.sessionId, sessionId))
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('Error updating user assessment:', error);
      throw error;
    }
  }

  async getConversation(sessionId: string): Promise<Conversation | undefined> {
    try {
      const result = await this.db
        .select()
        .from(conversations)
        .where(eq(conversations.sessionId, sessionId))
        .limit(1);
      
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return undefined;
    }
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    try {
      const result = await this.db
        .insert(conversations)
        .values(insertConversation)
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  async updateConversation(sessionId: string, messages: ChatMessage[]): Promise<Conversation> {
    try {
      const existing = await this.getConversation(sessionId);
      
      if (existing) {
        const result = await this.db
          .update(conversations)
          .set({ 
            messages: messages as any,
            updatedAt: new Date()
          })
          .where(eq(conversations.sessionId, sessionId))
          .returning();
        
        return result[0];
      } else {
        return this.createConversation({
          sessionId,
          messages: messages as any,
        });
      }
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  }

  async getCareerRecommendations(sessionId: string): Promise<CareerRecommendation[]> {
    try {
      const result = await this.db
        .select()
        .from(careerRecommendations)
        .where(eq(careerRecommendations.sessionId, sessionId));
      
      return result;
    } catch (error) {
      console.error('Error getting career recommendations:', error);
      return [];
    }
  }

  async createCareerRecommendation(insertRecommendation: InsertCareerRecommendation): Promise<CareerRecommendation> {
    try {
      const result = await this.db
        .insert(careerRecommendations)
        .values(insertRecommendation)
        .returning();
      
      return result[0];
    } catch (error) {
      console.error('Error creating career recommendation:', error);
      throw error;
    }
  }
}

// Storage factory function
function createStorage(): IStorage {
  if (process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
    try {
      return new DatabaseStorage();
    } catch (error) {
      console.warn('Failed to initialize database storage, falling back to memory storage:', error);
      return new MemStorage();
    }
  }
  
  console.log('Using in-memory storage for development');
  return new MemStorage();
}

export const storage = createStorage();
