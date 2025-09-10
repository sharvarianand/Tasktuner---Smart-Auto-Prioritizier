import { apiService } from './api';
import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
import { CalendarEvent, ApiResponse } from '../types';
import { API_ENDPOINTS } from '../config/constants';

export class CalendarService {
  private calendarId: string | null = null;

  // Request calendar permissions
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting calendar permissions:', error);
      return false;
    }
  }

  // Get default calendar
  async getDefaultCalendar(): Promise<string | null> {
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];
      this.calendarId = defaultCalendar?.id || null;
      return this.calendarId;
    } catch (error) {
      console.error('Error getting default calendar:', error);
      return null;
    }
  }

  // Create calendar event
  async createEvent(eventData: {
    title: string;
    startDate: Date;
    endDate: Date;
    notes?: string;
    location?: string;
  }): Promise<string | null> {
    try {
      if (!this.calendarId) {
        await this.getDefaultCalendar();
      }

      if (!this.calendarId) {
        throw new Error('No calendar available');
      }

      const eventId = await Calendar.createEventAsync(this.calendarId, {
        title: eventData.title,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        notes: eventData.notes,
        location: eventData.location,
        timeZone: 'UTC',
      });

      return eventId;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      return null;
    }
  }

  // Get calendar events
  async getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    try {
      const events = await Calendar.getEventsAsync([this.calendarId!], startDate, endDate);
      
      return events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.notes || '',
        startTime: event.startDate.toISOString(),
        endTime: event.endDate.toISOString(),
        allDay: event.allDay || false,
        location: event.location || '',
        source: 'local' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error getting calendar events:', error);
      return [];
    }
  }

  // Update calendar event
  async updateEvent(eventId: string, eventData: Partial<{
    title: string;
    startDate: Date;
    endDate: Date;
    notes: string;
    location: string;
  }>): Promise<boolean> {
    try {
      await Calendar.updateEventAsync(eventId, eventData);
      return true;
    } catch (error) {
      console.error('Error updating calendar event:', error);
      return false;
    }
  }

  // Delete calendar event
  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      await Calendar.deleteEventAsync(eventId);
      return true;
    } catch (error) {
      console.error('Error deleting calendar event:', error);
      return false;
    }
  }

  // Sync with backend calendar
  async syncWithBackend(): Promise<CalendarEvent[]> {
    try {
      const response = await apiService.get<ApiResponse<CalendarEvent[]>>(
        API_ENDPOINTS.calendar.events
      );
      return response.data || [];
    } catch (error) {
      console.error('Error syncing with backend calendar:', error);
      return [];
    }
  }

  // Create event from task (backend integration)
  async createEventFromTask(taskId: string, startTime: string, duration: number): Promise<any> {
    try {
      const response = await apiService.post<ApiResponse<any>>(
        API_ENDPOINTS.calendar.createEvent,
        { taskId, startTime, duration }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating event from task:', error);
      throw error;
    }
  }

  // Get Google Calendar auth URL
  async getGoogleAuthUrl(): Promise<string> {
    try {
      const response = await apiService.get<ApiResponse<{ authUrl: string }>>(
        API_ENDPOINTS.calendar.auth
      );
      return response.data!.authUrl;
    } catch (error) {
      console.error('Error getting Google auth URL:', error);
      throw error;
    }
  }

  // Sync with Google Calendar
  async syncGoogleCalendar(): Promise<any> {
    try {
      const response = await apiService.post<ApiResponse<any>>(
        API_ENDPOINTS.calendar.sync
      );
      return response.data;
    } catch (error) {
      console.error('Error syncing Google Calendar:', error);
      throw error;
    }
  }
}

export const calendarService = new CalendarService();
export default calendarService;
