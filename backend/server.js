const express = require('express');
const cors = require('cors');
require('dotenv').config();

const taskRoutes = require('./src/routes/taskRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const voiceRoutes = require('./src/routes/voiceRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/voice', voiceRoutes);

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
