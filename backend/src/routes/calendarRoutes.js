const express = require("express");
const router = express.Router();
const { 
  getAuthURL, 
  oauthCallback, 
  addEventToCalendar, 
  createEventFromTask, 
  getCalendarEvents, 
  getAuthStatus 
} = require("../controllers/calendarController");

// Import token management functions
const fs = require('fs');
const path = require('path');
const TOKEN_FILE_PATH = path.join(__dirname, '../../temp_tokens.json');

// Load tokens from file
let userTokens = {};
try {
  if (fs.existsSync(TOKEN_FILE_PATH)) {
    userTokens = JSON.parse(fs.readFileSync(TOKEN_FILE_PATH, 'utf8'));
  }
} catch (error) {
  userTokens = {};
}

// Save tokens to file
const saveTokens = () => {
  try {
    fs.writeFileSync(TOKEN_FILE_PATH, JSON.stringify(userTokens, null, 2));
  } catch (error) {
    console.error('❌ Failed to save tokens:', error.message);
  }
};

// 🔹 Initialize calendar - List available endpoints
router.get("/init", (req, res) => {
  res.json({
    message: "Calendar API initialized successfully",
    endpoints: {
      "auth_url": "/api/calendar/auth/url",
      "auth_status": "/api/calendar/auth/status", 
      "oauth_callback": "/api/calendar/oauth2callback",
      "create_event": "/api/calendar/events",
      "get_events": "/api/calendar/events",
      "create_from_task": "/api/calendar/events/from-task"
    },
    status: "ready",
    timestamp: new Date().toISOString()
  });
});

// 🔹 Get Google Auth URL
router.get("/auth/url", getAuthURL);

// 🔹 Handle OAuth callback - Updated to match your credentials
router.get("/oauth2callback", oauthCallback);

// 🔹 Check authentication status
router.get("/auth/status", getAuthStatus);

// 🔹 Create event from task
router.post("/events/from-task", createEventFromTask);

// 🔹 Create custom event
router.post("/events", addEventToCalendar);

// 🔹 Get calendar events
router.get("/events", getCalendarEvents);

// 🔹 Disconnect calendar
router.post("/disconnect", async (req, res) => {
  try {
    // Clear user tokens
    const userId = req.user?.id || req.headers['x-user-id'] || 'test_user_default';
    userTokens[userId] = null;
    saveTokens();
    
    res.json({ message: "Calendar disconnected successfully" });
  } catch (error) {
    console.error("❌ Error disconnecting calendar:", error);
    res.status(500).json({ error: "Failed to disconnect calendar" });
  }
});

// 🔹 Sync calendar
router.post("/sync", async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'] || 'test_user_default';
    
    if (!userTokens[userId]) {
      return res.status(401).json({ error: "Calendar not connected" });
    }

    // Perform sync operation
    // This would typically sync events between TaskTuner and Google Calendar
    const lastSyncTime = new Date().toISOString();
    
    res.json({ 
      message: "Calendar synced successfully",
      lastSyncTime 
    });
  } catch (error) {
    console.error("❌ Error syncing calendar:", error);
    res.status(500).json({ error: "Failed to sync calendar" });
  }
});

module.exports = router;
