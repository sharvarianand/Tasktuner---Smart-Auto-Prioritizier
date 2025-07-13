// src/controllers/calendarController.js
const GoogleCalendarService = require('../services/googleCalendarService');
const db = require('../config/firebase');
const fs = require('fs');
const path = require('path');

const calendarService = new GoogleCalendarService();

// 🔧 TEMPORARY FIX: Use consistent user ID for testing
const TEST_USER_ID = 'test_user_default';
const TOKEN_FILE_PATH = path.join(__dirname, '../../temp_tokens.json');

// Load tokens from file on startup
let userTokens = {};
try {
  if (fs.existsSync(TOKEN_FILE_PATH)) {
    userTokens = JSON.parse(fs.readFileSync(TOKEN_FILE_PATH, 'utf8'));
    console.log('📁 Loaded tokens from file:', Object.keys(userTokens));
  } else {
    userTokens = { [TEST_USER_ID]: null };
  }
} catch (error) {
  console.log('⚠️ Could not load tokens, starting fresh');
  userTokens = { [TEST_USER_ID]: null };
}

// Save tokens to file
const saveTokens = () => {
  try {
    fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(userTokens, null, 2));
    console.log('💾 Tokens saved to file');
  } catch (error) {
    console.error('❌ Failed to save tokens:', error.message);
  }
};

// 🔹 Step 1: Get Google Auth URL
const getAuthURL = (req, res) => {
  try {
    const authUrl = calendarService.getAuthUrl();
    console.log('✅ Generated Google Calendar auth URL');
    res.json({ authUrl });
  } catch (error) {
    console.error('❌ Error getting auth URL:', error.message);
    res.status(500).json({ error: 'Failed to get auth URL' });
  }
};

// 🔹 Step 2: Handle OAuth Callback
const oauthCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const tokens = await calendarService.getAccessToken(code);
    
    // 🔧 Store tokens using consistent TEST_USER_ID and save to file
    userTokens[TEST_USER_ID] = tokens;
    saveTokens();
    
    console.log('✅ Google Calendar authentication successful for:', TEST_USER_ID);
    console.log('🔑 Token stored successfully and saved to file');
    res.send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>✅ Google Calendar Connected Successfully!</h2>
          <p>You can now close this tab and test creating events!</p>
          <p><strong>Test User ID:</strong> ${TEST_USER_ID}</p>
          <p><strong>Tokens saved to file for persistence</strong></p>
          <script>
            setTimeout(() => {
              window.close();
            }, 3000);
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('❌ OAuth callback error:', error.message);
    res.send(`
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h2>❌ Authentication Failed</h2>
          <p>Please try again from TaskTuner.</p>
          <script>
            setTimeout(() => {
              window.close();
            }, 3000);
          </script>
        </body>
      </html>
    `);
  }
};

// 🔹 Step 3: Create Calendar Event from Task
const createEventFromTask = async (req, res) => {
  try {
    const { taskId, startTime, duration } = req.body;
    
    // 🔧 Use consistent TEST_USER_ID
    if (!userTokens[TEST_USER_ID]) {
      return res.status(401).json({ 
        error: 'Google Calendar not authenticated',
        message: 'Please authenticate first using /api/calendar/auth/url'
      });
    }

    // Set credentials for this user
    calendarService.setCredentials(userTokens[TEST_USER_ID]);

    // Get task details from database
    const taskDoc = await db.collection('tasks').doc(taskId).get();
    if (!taskDoc.exists) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const taskData = taskDoc.data();
    
    // Calculate end time
    const start = new Date(startTime);
    const end = new Date(start.getTime() + (duration * 60 * 1000)); // duration in minutes
    
    const eventData = {
      title: `📋 ${taskData.title}`,
      description: `Task: ${taskData.description}\nPriority: ${taskData.priority}\nDeadline: ${taskData.deadline}`,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };
    
    const event = await calendarService.createEvent(eventData);
    
    // Update task with calendar event ID
    await db.collection('tasks').doc(taskId).update({
      calendarEventId: event.id,
      scheduledTime: start.toISOString(),
      status: 'scheduled'
    });
    
    console.log('✅ Calendar event created for task:', taskId);
    res.json({ success: true, event, message: 'Task scheduled successfully!' });
  } catch (error) {
    console.error('❌ Error creating calendar event:', error.message);
    res.status(500).json({ error: 'Failed to create calendar event' });
  }
};

// 🔹 Step 4: Add Custom Event to Calendar
const addEventToCalendar = async (req, res) => {
  try {    
    // 🔧 Use consistent TEST_USER_ID
    if (!userTokens[TEST_USER_ID]) {
      return res.status(401).json({ 
        error: 'Google Calendar not authenticated',
        message: 'Please authenticate first using /api/calendar/auth/url'
      });
    }

    calendarService.setCredentials(userTokens[TEST_USER_ID]);

    const { summary, description, startTime, endTime } = req.body;

    
    const eventData = {
      title: summary,
      description: description,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    };

    const event = await calendarService.createEvent(eventData);

    console.log('✅ Custom event added to calendar');
    res.status(200).json({ 
      success: true, 
      message: "Event added to calendar", 
      eventLink: event.htmlLink,
      eventId: event.id
    });
  } catch (error) {
    console.error("❌ Failed to add event:", error.message);
    res.status(500).json({ error: "Failed to add event to calendar" });
  }
};

// 🔹 Step 5: Get Calendar Events
const getCalendarEvents = async (req, res) => {
  try {
    // 🔧 Use consistent TEST_USER_ID
    if (!userTokens[TEST_USER_ID]) {
      return res.status(401).json({ 
        error: 'Google Calendar not authenticated',
        message: 'Please authenticate first using /api/calendar/auth/url'
      });
    }

    calendarService.setCredentials(userTokens[TEST_USER_ID]);

    const { timeMin, timeMax } = req.query;
    const events = await calendarService.listEvents(timeMin, timeMax);

    res.json({ events });
  } catch (error) {
    console.error('❌ Error fetching calendar events:', error.message);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
};

// 🔹 Step 6: Check Authentication Status
const getAuthStatus = (req, res) => {
  // 🔧 Use consistent TEST_USER_ID
  const isAuthenticated = !!userTokens[TEST_USER_ID];
  
  res.json({ 
    isAuthenticated,
    testUserId: TEST_USER_ID,
    message: isAuthenticated ? 'Google Calendar connected' : 'Google Calendar not connected',
    debug: {
      hasTokens: !!userTokens[TEST_USER_ID],
      tokenKeys: Object.keys(userTokens)
    }
  });
};

module.exports = {
  getAuthURL,
  oauthCallback,
  addEventToCalendar,
  createEventFromTask,
  getCalendarEvents,
  getAuthStatus,
};
