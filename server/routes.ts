import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateCareerRecommendations, processChatMessage, generateCustomCareerPath } from "./services/aiService";
import { insertUserSchema, insertConversationSchema, insertCareerRecommendationSchema } from "@shared/schema";
import type { AssessmentData, ChatMessage } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate session ID for new users
  app.post("/api/session", async (req, res) => {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const user = await storage.createUser({
        sessionId,
        assessmentData: null,
      });

      res.json({ sessionId: user.sessionId });
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // Submit career assessment
  app.post("/api/assessment", async (req, res) => {
    try {
      const { sessionId, assessmentData } = req.body;
      
      if (!sessionId || !assessmentData) {
        return res.status(400).json({ message: "Session ID and assessment data are required" });
      }

      // Validate assessment data
      const assessmentSchema = z.object({
        currentSituation: z.string().min(1),
        educationLevel: z.string().min(1),
        experience: z.string().min(1),
        interests: z.array(z.string()).min(1),
        skills: z.array(z.string()).optional(),
        goals: z.string().optional(),
      });

      const validatedData = assessmentSchema.parse(assessmentData);

      // Update user with assessment data
      const user = await storage.updateUserAssessment(sessionId, validatedData);

      // Generate AI recommendations
      const recommendations = await generateCareerRecommendations(validatedData);

      // Store recommendations
      await storage.createCareerRecommendation({
        sessionId,
        recommendations: recommendations as any,
        assessmentData: validatedData as any,
      });

      res.json({ 
        success: true, 
        recommendations,
        message: "Assessment completed successfully"
      });
    } catch (error) {
      console.error('Error processing assessment:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process assessment" 
      });
    }
  });

  // Get career recommendations
  app.get("/api/recommendations/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const recommendations = await storage.getCareerRecommendations(sessionId);
      
      if (recommendations.length === 0) {
        return res.status(404).json({ message: "No recommendations found. Please complete the assessment first." });
      }

      res.json({ 
        recommendations: recommendations[0].recommendations,
        assessmentData: recommendations[0].assessmentData
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  // Chat with AI
  app.post("/api/chat", async (req, res) => {
    try {
      const { sessionId, message } = req.body;
      
      if (!sessionId || !message) {
        return res.status(400).json({ message: "Session ID and message are required" });
      }

      // Get existing conversation
      let conversation = await storage.getConversation(sessionId);
      const messages: ChatMessage[] = conversation?.messages ? 
        (conversation.messages as ChatMessage[]) : [];

      // Get user assessment data for context
      const user = await storage.getUser(sessionId);
      const assessmentData = user?.assessmentData as AssessmentData | undefined;

      // Process message with AI
      const aiResponse = await processChatMessage(message, messages, assessmentData);

      // Add user message and AI response to conversation
      const newMessages: ChatMessage[] = [
        ...messages,
        { role: 'user', content: message, timestamp: new Date() },
        { role: 'assistant', content: aiResponse, timestamp: new Date() }
      ];

      // Update conversation
      conversation = await storage.updateConversation(sessionId, newMessages);

      res.json({ 
        message: aiResponse,
        conversation: newMessages
      });
    } catch (error) {
      console.error('Error processing chat:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process your message" 
      });
    }
  });

  // Get conversation history
  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const conversation = await storage.getConversation(sessionId);
      
      res.json({ 
        messages: conversation?.messages || []
      });
    } catch (error) {
      console.error('Error fetching conversation:', error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Generate custom career path
  app.post("/api/career-path", async (req, res) => {
    try {
      const { interests, currentRole } = req.body;
      
      if (!interests || !Array.isArray(interests) || interests.length === 0) {
        return res.status(400).json({ message: "Interests array is required" });
      }

      const careerPath = await generateCustomCareerPath(interests, currentRole);
      
      res.json({ careerPath });
    } catch (error) {
      console.error('Error generating career path:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate career path" 
      });
    }
  });

  // Get sample resources (static data for demo)
  app.get("/api/resources", async (req, res) => {
    try {
      const resources = [
        {
          id: "1",
          title: "CS50 Introduction to Computer Science",
          provider: "Harvard University",
          description: "A comprehensive introduction to computer science and programming",
          type: "course",
          price: "Free",
          duration: "12 weeks",
          url: "https://cs50.harvard.edu/",
          category: "technology"
        },
        {
          id: "2",
          title: "Google Data Analytics Certificate",
          provider: "Google Career Certificates",
          description: "Learn data analytics skills and tools used by professionals",
          type: "certification",
          price: "$49/month",
          duration: "6 months",
          url: "https://www.coursera.org/professional-certificates/google-data-analytics",
          category: "data"
        },
        {
          id: "3",
          title: "The Complete Guide to UX Design",
          provider: "Interaction Design Foundation",
          description: "Master user experience design principles and methodologies",
          type: "course",
          price: "$16/month",
          duration: "Self-paced",
          url: "https://www.interaction-design.org/",
          category: "design"
        }
      ];

      res.json({ resources });
    } catch (error) {
      console.error('Error fetching resources:', error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
