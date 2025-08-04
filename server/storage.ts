import { 
  type User, 
  type InsertUser,
  type Conversation,
  type InsertConversation,
  type CareerRecommendation,
  type InsertCareerRecommendation,
  type ChatMessage,
  type AssessmentData
} from "@shared/schema";
import { randomUUID } from "crypto";

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

export const storage = new MemStorage();
