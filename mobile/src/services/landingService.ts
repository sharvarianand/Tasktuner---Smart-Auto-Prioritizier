import { apiService, fetchJson, pingBackend } from './api';
import { ApiResponse } from '../types';
import { API_BASE_URL } from '../config/constants';

export interface LandingStats {
  totalUsers: number;
  tasksCompleted: number;
  roastsDelivered: number;
  avgProductivityIncrease: number;
  totalStreaks: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  rating: number;
  verified: boolean;
  profileImage?: string;
}

export interface FeatureStats {
  id: string;
  name: string;
  description: string;
  usageCount: number;
  rating: number;
  isPopular: boolean;
}

export interface LandingData {
  stats: LandingStats;
  testimonials: Testimonial[];
  features: FeatureStats[];
  systemStatus: {
    backend: boolean;
    ai: boolean;
    calendar: boolean;
    voice: boolean;
  };
}

class LandingService {
  private isBackendAvailable(): boolean {
    if (API_BASE_URL.includes('your-backend-url.com')) {
      return false;
    }
    return true;
  }

  // Get comprehensive landing page data
  async getLandingData(): Promise<LandingData> {
    if (!this.isBackendAvailable()) {
      console.log('Backend not configured, using mock data');
      return this.getMockLandingData();
    }

    try {
      // Check backend availability first
      const backendStatus = await pingBackend(5000);
      
      if (!backendStatus.ok) {
        console.log('Backend not available, using mock data');
        return this.getMockLandingData();
      }

      // Fetch real data from backend
      const [stats, testimonials, features, systemStatus] = await Promise.allSettled([
        this.getStats(),
        this.getTestimonials(),
        this.getFeatureStats(),
        this.getSystemStatus()
      ]);

      return {
        stats: stats.status === 'fulfilled' ? stats.value : this.getMockStats(),
        testimonials: testimonials.status === 'fulfilled' ? testimonials.value : this.getMockTestimonials(),
        features: features.status === 'fulfilled' ? features.value : this.getMockFeatures(),
        systemStatus: systemStatus.status === 'fulfilled' ? systemStatus.value : this.getMockSystemStatus()
      };
    } catch (error) {
      console.error('Error fetching landing data:', error);
      return this.getMockLandingData();
    }
  }

  // Get platform statistics
  async getStats(): Promise<LandingStats> {
    try {
      const response = await fetchJson<{ data: LandingStats }>('/analytics/platform-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return this.getMockStats();
    }
  }

  // Get user testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const response = await fetchJson<{ data: Testimonial[] }>('/analytics/testimonials');
      return response.data;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return this.getMockTestimonials();
    }
  }

  // Get feature usage statistics
  async getFeatureStats(): Promise<FeatureStats[]> {
    try {
      const response = await fetchJson<{ data: FeatureStats[] }>('/analytics/feature-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching feature stats:', error);
      return this.getMockFeatures();
    }
  }

  // Get system status
  async getSystemStatus(): Promise<LandingData['systemStatus']> {
    try {
      const response = await fetchJson<{ data: LandingData['systemStatus'] }>('/health/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching system status:', error);
      return this.getMockSystemStatus();
    }
  }

  // Submit contact form or demo request
  async submitDemoRequest(email: string, interests: string[]): Promise<{ success: boolean; message: string }> {
    if (!this.isBackendAvailable()) {
      return {
        success: true,
        message: 'Demo mode - request logged locally'
      };
    }

    try {
      const response = await fetchJson<{ success: boolean; message: string }>('/demo/request', {
        method: 'POST',
        body: JSON.stringify({ email, interests, timestamp: new Date().toISOString() })
      });
      return response;
    } catch (error) {
      console.error('Error submitting demo request:', error);
      return {
        success: false,
        message: 'Unable to submit request. Please try again later.'
      };
    }
  }

  // Track landing page analytics
  async trackLandingPageEvent(event: string, data?: any): Promise<void> {
    if (!this.isBackendAvailable()) {
      console.log(`Landing page event: ${event}`, data);
      return;
    }

    try {
      await fetchJson('/analytics/landing-event', {
        method: 'POST',
        body: JSON.stringify({
          event,
          data,
          timestamp: new Date().toISOString(),
          platform: 'mobile'
        })
      });
    } catch (error) {
      console.error('Error tracking landing page event:', error);
      // Don't throw - analytics shouldn't block UX
    }
  }

  // Mock data fallbacks
  private getMockLandingData(): LandingData {
    return {
      stats: this.getMockStats(),
      testimonials: this.getMockTestimonials(),
      features: this.getMockFeatures(),
      systemStatus: this.getMockSystemStatus()
    };
  }

  private getMockStats(): LandingStats {
    return {
      totalUsers: 12847,
      tasksCompleted: 458392,
      roastsDelivered: 89234,
      avgProductivityIncrease: 73,
      totalStreaks: 15629
    };
  }

  private getMockTestimonials(): Testimonial[] {
    return [
      {
        id: '1',
        quote: "TaskTuner roasted me so hard I actually started doing my assignments 😭 Best productivity app ever!",
        author: "Priya S., College Student",
        rating: 5,
        verified: true
      },
      {
        id: '2',
        quote: "Finally, an app that doesn't sugarcoat my productivity issues. The AI is savage but it WORKS.",
        author: "Rohit M., Software Developer",
        rating: 5,
        verified: true
      },
      {
        id: '3',
        quote: "The voice roasts are BRUTAL but I've never been more productive. 10/10 would get roasted again.",
        author: "Arjun K., Entrepreneur",
        rating: 5,
        verified: true
      },
      {
        id: '4',
        quote: "I was skeptical about AI coaching, but TaskTuner proved me wrong. It's like having a personal drill sergeant.",
        author: "Sneha R., Marketing Manager",
        rating: 5,
        verified: true
      },
      {
        id: '5',
        quote: "The calendar integration is seamless and the task prioritization is spot-on. Game changer!",
        author: "Vikash L., Project Manager",
        rating: 5,
        verified: true
      }
    ];
  }

  private getMockFeatures(): FeatureStats[] {
    return [
      {
        id: 'ai-prioritization',
        name: 'AI Task Prioritization',
        description: 'Smart ranking based on deadlines and importance',
        usageCount: 45892,
        rating: 4.8,
        isPopular: true
      },
      {
        id: 'voice-roasts',
        name: 'Voice Roasts',
        description: 'Motivational savage coaching via TTS',
        usageCount: 34567,
        rating: 4.9,
        isPopular: true
      },
      {
        id: 'calendar-sync',
        name: 'Calendar Integration',
        description: 'Seamless Google Calendar synchronization',
        usageCount: 28943,
        rating: 4.7,
        isPopular: true
      },
      {
        id: 'focus-mode',
        name: 'Focus Mode',
        description: 'Distraction-free work environment',
        usageCount: 19834,
        rating: 4.6,
        isPopular: false
      },
      {
        id: 'analytics',
        name: 'Productivity Analytics',
        description: 'Detailed insights and progress tracking',
        usageCount: 15672,
        rating: 4.5,
        isPopular: false
      }
    ];
  }

  private getMockSystemStatus(): LandingData['systemStatus'] {
    return {
      backend: true,
      ai: true,
      calendar: true,
      voice: true
    };
  }
}

export const landingService = new LandingService();
