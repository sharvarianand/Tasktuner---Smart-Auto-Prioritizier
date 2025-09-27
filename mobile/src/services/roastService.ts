import { apiService, fetchJson, pingBackend } from './api';
import { ApiResponse } from '../types';
import { API_BASE_URL } from '../config/constants';

export interface Roast {
  id: number;
  message: string;
  severity: 'mild' | 'medium' | 'spicy' | 'brutal';
  category?: string;
  context?: string;
  createdAt?: string;
}

export interface RoastRequest {
  userInput?: string;
  context?: string;
  severity?: 'mild' | 'medium' | 'spicy' | 'brutal';
}

export interface RoastResponse {
  roast: Roast;
  suggestions?: string[];
  stats?: {
    totalRoasts: number;
    userLevel: string;
  };
}

class RoastService {
  // Check if backend is available and responsive
  private async isBackendAvailable(): Promise<boolean> {
    // If it's a placeholder URL, backend is not configured
    if (API_BASE_URL.includes('your-backend-url.com')) {
      return false;
    }
    
    try {
      const status = await pingBackend(3000);
      return status.ok;
    } catch (error) {
      console.log('Backend ping failed:', error);
      return false;
    }
  }

  // Get a random roast from the backend
  async getRandomRoast(): Promise<Roast> {
    const backendAvailable = await this.isBackendAvailable();
    
    if (!backendAvailable) {
      if (__DEV__) {
        console.log('Using local roast - backend not available');
      }
      return this.getLocalRoast();
    }

    try {
      const response = await fetchJson<{ data: Roast }>('/ai/roast/random');
      return response.data || this.getLocalRoast();
    } catch (error) {
      console.error('Error fetching random roast:', error);
      return this.getLocalRoast();
    }
  }

  // Generate a custom roast based on user input
  async generateCustomRoast(request: RoastRequest): Promise<RoastResponse> {
    const backendAvailable = await this.isBackendAvailable();
    
    if (!backendAvailable) {
      if (__DEV__) {
        console.log('Using local roast - backend not available');
      }
      return {
        roast: this.getLocalRoast(),
        suggestions: ['Backend not configured', 'Using local roast']
      };
    }

    try {
      const response = await fetchJson<{ data: RoastResponse }>('/ai/generate-roast', {
        method: 'POST',
        body: JSON.stringify(request)
      });
      return response.data || {
        roast: this.getLocalRoast(),
        suggestions: ['Error generating custom roast']
      };
    } catch (error) {
      console.error('Error generating custom roast:', error);
      return {
        roast: this.getLocalRoast(),
        suggestions: ['Try again later', 'Check your connection']
      };
    }
  }

  // Get roast statistics
  async getRoastStats(): Promise<{ totalRoasts: number; favoriteSeverity: string }> {
    const backendAvailable = await this.isBackendAvailable();
    
    if (!backendAvailable) {
      if (__DEV__) {
        console.log('Using default roast stats - backend not available');
      }
      return { totalRoasts: 0, favoriteSeverity: 'medium' };
    }

    try {
      const response = await fetchJson<{ data: { totalRoasts: number; favoriteSeverity: string } }>('/analytics/roast-stats');
      return response.data || { totalRoasts: 0, favoriteSeverity: 'medium' };
    } catch (error) {
      console.error('Error fetching roast stats:', error);
      return { totalRoasts: 0, favoriteSeverity: 'medium' };
    }
  }

  // Track roast interaction for analytics
  async trackRoastInteraction(roastId: number, action: 'viewed' | 'regenerated' | 'spoken' | 'shared'): Promise<void> {
    const backendAvailable = await this.isBackendAvailable();
    
    if (!backendAvailable) {
      console.log(`Roast interaction: ${action} for roast ${roastId}`);
      return;
    }

    try {
      await fetchJson('/analytics/roast-interaction', {
        method: 'POST',
        body: JSON.stringify({
          roastId,
          action,
          timestamp: new Date().toISOString(),
          platform: 'mobile'
        })
      });
    } catch (error) {
      console.error('Error tracking roast interaction:', error);
      // Don't throw - analytics shouldn't block UX
    }
  }

  // Get roast by severity level
  async getRoastBySeverity(severity: 'mild' | 'medium' | 'spicy' | 'brutal'): Promise<Roast> {
    const backendAvailable = await this.isBackendAvailable();
    
    if (!backendAvailable) {
      return this.getLocalRoastBySeverity(severity);
    }

    try {
      const response = await fetchJson<{ data: Roast }>(`/ai/roast/by-severity/${severity}`);
      return response.data || this.getLocalRoastBySeverity(severity);
    } catch (error) {
      console.error('Error fetching roast by severity:', error);
      return this.getLocalRoastBySeverity(severity);
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

  // Get local roast by severity
  private getLocalRoastBySeverity(severity: 'mild' | 'medium' | 'spicy' | 'brutal'): Roast {
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

    const severityRoasts = localRoasts.filter(roast => roast.severity === severity);
    if (severityRoasts.length === 0) {
      // Fallback to random roast if no match found
      return this.getLocalRoast();
    }
    
    const randomIndex = Math.floor(Math.random() * severityRoasts.length);
    return severityRoasts[randomIndex];
  }
}

export const roastService = new RoastService();
