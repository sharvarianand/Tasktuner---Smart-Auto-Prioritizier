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

module.exports = router;
