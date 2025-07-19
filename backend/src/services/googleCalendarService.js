require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class GoogleCalendarService {
  constructor() {
    this.credentials = this.loadCredentials();
    this.oauth2Client = new google.auth.OAuth2(
      this.credentials.web.client_id,
      this.credentials.web.client_secret,
      this.credentials.web.redirect_uris[0]
    );
    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
  }

  loadCredentials() {
    try {
      const credentialsPath = path.resolve(__dirname, '../../', process.env.GOOGLE_CREDENTIALS_PATH);
      console.log('📁 Looking for Google credentials at:', credentialsPath);
      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      console.log('✅ Google Calendar credentials loaded successfully');
      return credentials;
    } catch (error) {
      console.error('❌ Error loading Google Calendar credentials:', error.message);
      throw error;
    }
  }

  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  async getAccessToken(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      return tokens;
    } catch (error) {
      console.error('❌ Error getting access token:', error.message);
      throw error;
    }
  }

  setCredentials(tokens) {
    this.oauth2Client.setCredentials(tokens);
  }

  async createEvent(eventData) {
    try {
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime,
          timeZone: 'Asia/Kolkata',  // ✅ Updated timezone
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: 'Asia/Kolkata',  // ✅ Updated timezone
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      };

      console.log("📅 Creating Event With:", event); // ✅ Added for debugging

      const response = await this.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      console.log('✅ Calendar event created:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating calendar event:', error.message);
      throw error;
    }
  }

  async listEvents(timeMin, timeMax) {
    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin,
        timeMax: timeMax,
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });

      console.log('✅ Calendar events fetched:', response.data.items?.length || 0);
      return response.data.items || [];
    } catch (error) {
      console.error('❌ Error fetching calendar events:', error.message);
      throw error;
    }
  }

  async updateEvent(eventId, eventData) {
    try {
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime,
          timeZone: 'Asia/Kolkata',  // ✅ Updated timezone
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: 'Asia/Kolkata',  // ✅ Updated timezone
        },
      };

      const response = await this.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event,
      });

      console.log('✅ Calendar event updated:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating calendar event:', error.message);
      throw error;
    }
  }

  async deleteEvent(eventId) {
    try {
      await this.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });

      console.log('✅ Calendar event deleted:', eventId);
      return true;
    } catch (error) {
      console.error('❌ Error deleting calendar event:', error.message);
      throw error;
    }
  }
}

module.exports = GoogleCalendarService;
