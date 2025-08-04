import type { AssessmentData, ChatMessage, CareerPath } from '@shared/schema';
import { useState } from 'react';

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public errors?: any[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// Generic API request function with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        // If response is not JSON, use status text
        errorData = { message: response.statusText };
      }

      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData.code,
        errorData.errors
      );
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408, 'TIMEOUT');
    }
    
    throw new ApiError('Network error', 0, 'NETWORK_ERROR');
  }
}

// API functions
export const api = {
  // Create a new session
  createSession: async (): Promise<{ sessionId: string }> => {
    return apiRequest('/api/session', {
      method: 'POST',
    });
  },

  // Submit career assessment
  submitAssessment: async (
    sessionId: string,
    assessmentData: AssessmentData
  ): Promise<{ success: boolean; recommendations: CareerPath[]; message: string }> => {
    return apiRequest('/api/assessment', {
      method: 'POST',
      body: JSON.stringify({ sessionId, assessmentData }),
    });
  },

  // Get career recommendations
  getRecommendations: async (sessionId: string): Promise<CareerPath[]> => {
    const response = await apiRequest<{ recommendations: CareerPath[] }>(
      `/api/recommendations/${sessionId}`
    );
    return response.recommendations;
  },

  // Send chat message
  sendChatMessage: async (
    sessionId: string,
    message: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<{ response: string; conversationHistory: ChatMessage[] }> => {
    return apiRequest('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ sessionId, message, conversationHistory }),
    });
  },

  // Generate custom career path
  generateCustomCareerPath: async (
    sessionId: string,
    careerGoal: string,
    timeframe: string,
    additionalInfo?: string
  ): Promise<CareerPath> => {
    return apiRequest('/api/custom-career-path', {
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        careerGoal,
        timeframe,
        additionalInfo,
      }),
    });
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string; uptime: number }> => {
    return apiRequest('/health');
  },
};

// Helper function to handle API errors in components
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'TIMEOUT':
        return 'Request timed out. Please try again.';
      case 'NETWORK_ERROR':
        return 'Network error. Please check your connection.';
      case 'RATE_LIMIT_EXCEEDED':
        return 'Too many requests. Please wait before trying again.';
      case 'SESSION_NOT_FOUND':
        return 'Session expired. Please refresh the page.';
      case 'AI_SERVICE_UNAVAILABLE':
        return 'AI service is temporarily unavailable. Showing demo content.';
      default:
        return error.message;
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Hook for managing API loading states
export const useApiState = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      return result;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
  };

  return { loading, error, execute, reset };
};