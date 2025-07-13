const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', require('./src/routes/taskRoutes'));
app.use('/api/ai', require('./src/routes/aiRoutes'));

// Health Check Route
app.get('/', (req, res) => {
  res.send('TaskTuner backend is running 🧠🔥');
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
