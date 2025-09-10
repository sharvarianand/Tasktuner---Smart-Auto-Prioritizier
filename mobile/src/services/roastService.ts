import { apiService } from './api';
import { ApiResponse } from '../types';
import { API_BASE_URL } from '../config/constants';

export interface Roast {
  id: number;
  message: string;
  severity: 'mild' | 'medium' | 'spicy' | 'brutal';
  category?: string;
}

export interface RoastRequest {
  userInput?: string;
  context?: string;
}

export interface RoastResponse {
  roast: Roast;
  suggestions?: string[];
}

class RoastService {
  // Check if backend is available (not a placeholder URL)
  private isBackendAvailable(): boolean {
    return !API_BASE_URL.includes('your-backend-url.com');
  }

  // Get a random roast from the backend
  async getRandomRoast(): Promise<Roast> {
    // Skip API call if backend is not configured
    if (!this.isBackendAvailable()) {
      if (__DEV__) {
        console.log('Using local roast - backend not configured');
      }
      return this.getLocalRoast();
    }

    try {
      const response = await apiService.get<ApiResponse<Roast>>('/ai/roast/random');
      return response.data;
    } catch (error) {
      // Silently fall back to local roast in development
      if (__DEV__) {
        console.log('Using local roast - backend not available');
      }
      return this.getLocalRoast();
    }
  }

  // Generate a custom roast based on user input
  async generateCustomRoast(request: RoastRequest): Promise<RoastResponse> {
    // Skip API call if backend is not configured
    if (!this.isBackendAvailable()) {
      if (__DEV__) {
        console.log('Using local roast - backend not configured');
      }
      return {
        roast: this.getLocalRoast(),
        suggestions: ['Backend not configured', 'Using local roast']
      };
    }

    try {
      const response = await apiService.post<ApiResponse<RoastResponse>>('/roast/generate', request);
      return response.data;
    } catch (error) {
      // Silently fall back to local roast in development
      if (__DEV__) {
        console.log('Using local roast - backend not available');
      }
      return {
        roast: this.getLocalRoast(),
        suggestions: ['Try again later', 'Check your connection']
      };
    }
  }

  // Get roast statistics
  async getRoastStats(): Promise<{ totalRoasts: number; favoriteSeverity: string }> {
    // Skip API call if backend is not configured
    if (!this.isBackendAvailable()) {
      if (__DEV__) {
        console.log('Using default roast stats - backend not configured');
      }
      return { totalRoasts: 0, favoriteSeverity: 'medium' };
    }

    try {
      const response = await apiService.get<ApiResponse<{ totalRoasts: number; favoriteSeverity: string }>>('/roast/stats');
      return response.data;
    } catch (error) {
      // Silently fall back to defaults in development
      if (__DEV__) {
        console.log('Using default roast stats - backend not available');
      }
      return { totalRoasts: 0, favoriteSeverity: 'medium' };
    }
  }

  // Fallback local roasts when backend is unavailable
  private getLocalRoast(): Roast {
    const localRoasts: Roast[] = [
      {
        id: 1,
        message: "Still scrolling social media instead of being productive? Time to get your act together!",
        severity: "mild"
      },
      {
        id: 2,
        message: "Your to-do list is longer than a CVS receipt. Maybe it's time to actually DO something about it?",
        severity: "medium"
      },
      {
        id: 3,
        message: "You've been 'planning to start tomorrow' for 47 tomorrows. Today IS tomorrow!",
        severity: "spicy"
      },
      {
        id: 4,
        message: "Your procrastination skills are Olympic-level. Too bad they don't give medals for that.",
        severity: "brutal"
      },
      {
        id: 5,
        message: "You know what's harder than starting? Explaining why you didn't start. Again.",
        severity: "medium"
      },
      {
        id: 6,
        message: "Your future self called. They're disappointed but not surprised.",
        severity: "spicy"
      },
      {
        id: 7,
        message: "You've mastered the art of 'productive procrastination' - congratulations, you're still not getting anything done.",
        severity: "brutal"
      },
      {
        id: 8,
        message: "Your motivation is like a New Year's resolution - strong in January, gone by February.",
        severity: "medium"
      }
    ];

    const randomIndex = Math.floor(Math.random() * localRoasts.length);
    return localRoasts[randomIndex];
  }
}

export const roastService = new RoastService();
