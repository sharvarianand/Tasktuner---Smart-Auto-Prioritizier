const fetch = require('node-fetch');

const complexTestTasks = [
  { 
    id: '1', 
    title: 'Submit final project proposal', 
    description: 'Complete research and write final draft for capstone project. Due tomorrow at 9am.', 
    priority: 'High', 
    category: 'Academic',
    dueDate: new Date(Date.now() + 24*60*60*1000).toISOString(),
    startTime: '09:00',
    endTime: '12:00'
  },
  { 
    id: '2', 
    title: 'Buy birthday gift for mom', 
    description: 'Find something nice, her birthday is next week', 
    priority: 'Medium', 
    category: 'Personal',
    dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString()
  },
  { 
    id: '3', 
    title: 'Call dentist for appointment', 
    description: 'Quick 5 minute call to schedule routine cleaning', 
    priority: 'Low', 
    category: 'Personal'
  },
  { 
    id: '4', 
    title: 'Complete quarterly report', 
    description: 'Analyze Q3 data and prepare presentation for board meeting. Due this week.', 
    priority: 'High', 
    category: 'Work',
    dueDate: new Date(Date.now() + 3*24*60*60*1000).toISOString(),
    startTime: '14:00',
    endTime: '17:00'
  },
  { 
    id: '5', 
    title: 'Review budget spreadsheet', 
    description: 'Quick review of monthly expenses', 
    priority: 'Medium', 
    category: 'Work'
  }
];

fetch('http://localhost:3001/api/ai/prioritize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': 'test-user'
  },
  body: JSON.stringify({ 
    tasks: complexTestTasks,
    userContext: {
      currentTime: new Date(),
      timezone: 'America/New_York',
      workingHours: { start: 9, end: 17 }
    }
  })
})
.then(res => res.json())
.then(data => {
  console.log('🤖 AI Prioritization Results:');
  console.log('==================================');
  
  if (data.prioritizedTasks) {
    data.prioritizedTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.title} (${task.priority} | ${task.category})`);
      if (task.aiInsights) {
        console.log(`   🧠 AI Insights: ${JSON.stringify(task.aiInsights)}`);
      }
    });
  }
  
  console.log('\n📊 AI Analysis:');
  if (data.insights) {
    data.insights.forEach(insight => console.log(`   • ${insight}`));
  }
  
  console.log('\n✅ Prioritization is working properly!');
})
.catch(err => {
  console.error('❌ AI Prioritization Failed:', err.message);
  console.log('Check if backend server is running on localhost:3001');
});