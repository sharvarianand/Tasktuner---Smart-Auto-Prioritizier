const express = require('express');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./src/routes/taskRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const voiceRoutes = require('./src/routes/voiceRoutes');
const userRoutes = require("./src/routes/userRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");
const notificationRoutes = require('./src/routes/notificationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/voice', voiceRoutes);
app.use("/api/user", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check Route
app.get('/', (req, res) => {
  res.send('✅ TaskTuner backend is running 🧠🔥');
});

// Global Error Handling (Optional but good practice)
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
