import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull().unique(),
  assessmentData: jsonb("assessment_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  messages: jsonb("messages").notNull().default('[]'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const careerRecommendations = pgTable("career_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  assessmentData: jsonb("assessment_data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCareerRecommendationSchema = createInsertSchema(careerRecommendations).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertCareerRecommendation = z.infer<typeof insertCareerRecommendationSchema>;
export type CareerRecommendation = typeof careerRecommendations.$inferSelect;

// Frontend types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AssessmentData {
  currentSituation: string;
  educationLevel: string;
  experience: string;
  interests: string[];
  skills?: string[];
  goals?: string;
}

export interface CareerPath {
  title: string;
  description: string;
  steps: {
    title: string;
    description: string;
    duration: string;
    skills: string[];
  }[];
  salaryRange?: string;
  growthProjection?: string;
}

export interface Resource {
  id: string;
  title: string;
  provider: string;
  description: string;
  type: 'course' | 'certification' | 'book' | 'article';
  price: string;
  duration: string;
  url: string;
  category: string;
}
