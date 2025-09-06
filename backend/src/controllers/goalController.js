// src/controllers/goalController.js
const db = require('../config/firebase');
const openai = require('../config/openai');

// AI-powered task generation function
const generateAITasks = async (goalTitle, goalDescription, goalCategory, targetDate) => {
  try {
    console.log('🤖 Generating AI tasks for goal:', goalTitle);
    
    const prompt = `You are an expert productivity coach and project manager. Analyze the following goal and break it down into 6-8 specific, actionable tasks that will help achieve this goal.

GOAL DETAILS:
Title: "${goalTitle}"
Description: "${goalDescription}"
Category: "${goalCategory}"
Target Date: ${targetDate ? new Date(targetDate).toLocaleDateString() : 'No specific date'}

INSTRUCTIONS:
1. Analyze the goal description carefully to understand what needs to be accomplished
2. Create specific, actionable tasks that directly contribute to achieving this goal
3. Make tasks concrete and measurable (not vague like "work on goal")
4. Consider the category and context when generating relevant tasks
5. Order tasks logically (prerequisites first, then implementation, then completion)
6. Each task should be something that can be completed in 1-4 hours

RESPONSE FORMAT:
Return ONLY a valid JSON array of task objects, like this:
[
  { "title": "Research market trends in finance technology", "priority": "high" },
  { "title": "Define project requirements and scope", "priority": "high" },
  { "title": "Create wireframes for the application", "priority": "medium" },
  { "title": "Set up development environment and tools", "priority": "medium" },
  { "title": "Implement core functionality", "priority": "high" },
  { "title": "Test and debug the application", "priority": "medium" },
  { "title": "Prepare presentation materials", "priority": "low" },
  { "title": "Practice demo and pitch", "priority": "low" }
]

Each task should have:
- title: A specific, actionable task description
- priority: "high", "medium", or "low" based on importance and urgency

Respond only with the JSON array. No explanations or additional text.`;

    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.7,
    });

    const aiOutput = response.choices[0].message.content.trim();
    console.log('🎯 AI Response:', aiOutput);
    
    // Clean up the response to ensure it's valid JSON
    let cleanOutput = aiOutput;
    if (!cleanOutput.startsWith('[')) {
      const startIndex = cleanOutput.indexOf('[');
      if (startIndex !== -1) {
        cleanOutput = cleanOutput.substring(startIndex);
      }
    }
    if (!cleanOutput.endsWith(']')) {
      const endIndex = cleanOutput.lastIndexOf(']');
      if (endIndex !== -1) {
        cleanOutput = cleanOutput.substring(0, endIndex + 1);
      }
    }

    const parsedTasks = JSON.parse(cleanOutput);
    console.log('✅ Parsed AI tasks:', parsedTasks);
    
    return parsedTasks;
    
  } catch (error) {
    console.error('❌ AI task generation failed:', error);
    console.log('🔄 Falling back to simple task generation');
    
    // Fallback to simple task generation
    return generateSimpleTasks(`${goalTitle}: ${goalDescription}`);
  }
};

// Simple task generation function (fallback)
const generateSimpleTasks = (goalText) => {
  const tasks = [];
  const goal = goalText.toLowerCase();
  
  // Basic task patterns based on common goal types
  if (goal.includes('learn') || goal.includes('study')) {
    tasks.push(
      'Research the topic thoroughly',
      'Create a study schedule',
      'Find learning resources',
      'Practice regularly',
      'Track progress weekly'
    );
  } else if (goal.includes('build') || goal.includes('create')) {
    tasks.push(
      'Plan the project structure',
      'Set up development environment',
      'Create initial prototype',
      'Test and iterate',
      'Deploy and maintain'
    );
  } else if (goal.includes('fitness') || goal.includes('health')) {
    tasks.push(
      'Create workout schedule',
      'Plan healthy meals',
      'Track daily progress',
      'Set weekly targets',
      'Monitor improvements'
    );
  } else {
    // Generic tasks
    tasks.push(
      'Define clear objectives',
      'Create action plan',
      'Set milestones',
      'Track progress',
      'Review and adjust'
    );
  }
  
  return tasks.map(title => ({ title, priority: 'medium' }));
};

// ✅ GET all goals for a specific user
const getGoals = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'];
    
    console.log('📋 Fetching goals for user:', userId);
    console.log('📋 Request headers:', req.headers);
    console.log('📋 Request user:', req.user);

    if (!userId) {
      console.log('❌ No user ID provided for goals fetch');
      return res.status(401).json({ error: "User authentication required" });
    }

    console.log('📋 Querying Firebase for goals...');
    const snapshot = await db.collection("goals")
      .where("userId", "==", userId)
      .get();

    console.log('📋 Firebase query completed, processing results...');
    const goals = [];

    snapshot.forEach(doc => {
      const goalData = doc.data();
      goals.push({
        id: doc.id,
        ...goalData,
        // Convert Firestore timestamp to ISO string if needed
        createdAt: goalData.createdAt?.toDate?.() || goalData.createdAt,
        targetDate: goalData.targetDate?.toDate?.() || goalData.targetDate,
        updatedAt: goalData.updatedAt?.toDate?.() || goalData.updatedAt
      });
    });

    console.log(`✅ Found ${goals.length} goals for user ${userId}`);
    console.log('📋 Goals data:', goals);
    res.status(200).json(goals);
  } catch (error) {
    console.error("❌ Error fetching goals:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
};

// ✅ POST create goal
const createGoal = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'];
    
    console.log('🎯 Creating goal for user:', userId);
    console.log('📝 Goal data:', req.body);
    
    if (!userId) {
      console.log('❌ No user ID provided');
      return res.status(401).json({ error: "User authentication required" });
    }

    const { 
      title, 
      description, 
      targetDate,
      category, 
      priority 
    } = req.body;

    if (!title || !title.trim()) {
      console.log('❌ No title provided');
      return res.status(400).json({ error: "Goal title is required" });
    }

    const goalData = {
      userId,
      title: title.trim(),
      description: description?.trim() || '',
      targetDate: targetDate ? new Date(targetDate) : null,
      category: category || 'Personal',
      priority: priority || 'Medium',
      status: 'active',
      progress: 0,
      totalTasks: 0,
      completedTasks: 0,
      subtasks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('💾 Saving goal to database:', goalData);
    const docRef = await db.collection("goals").add(goalData);
    const createdGoal = { id: docRef.id, ...goalData };

    console.log('✅ Goal created successfully:', createdGoal);
    res.status(201).json(createdGoal);
  } catch (error) {
    console.error("❌ Error creating goal:", error);
    res.status(500).json({ error: "Failed to create goal" });
  }
};

// ✅ PUT update goal
const updateGoal = async (req, res) => {
  try {
    const goalId = req.params.id;
    const userId = req.user?.id || req.headers['x-user-id'];
    const updatedData = req.body;

    if (!userId) {
      return res.status(401).json({ error: "User authentication required" });
    }

    const goalRef = db.collection("goals").doc(goalId);
    const doc = await goalRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const goalData = doc.data();

    // Verify goal belongs to user
    if (goalData.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Update the goal
    await goalRef.update({
      ...updatedData,
      updatedAt: new Date(),
    });

    // Return the updated goal
    const updatedDoc = await goalRef.get();
    const updatedGoalData = updatedDoc.data();
    const updatedGoal = {
      id: updatedDoc.id,
      ...updatedGoalData,
      createdAt: updatedGoalData.createdAt?.toDate?.() || updatedGoalData.createdAt,
      targetDate: updatedGoalData.targetDate?.toDate?.() || updatedGoalData.targetDate,
      updatedAt: updatedGoalData.updatedAt?.toDate?.() || updatedGoalData.updatedAt,
    };

    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error("❌ Error updating goal:", error);
    res.status(500).json({ error: "Failed to update goal" });
  }
};

// ✅ DELETE goal
const deleteGoal = async (req, res) => {
  try {
    const goalId = req.params.id;
    const userId = req.user?.id || req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: "User authentication required" });
    }

    const goalRef = db.collection("goals").doc(goalId);
    const doc = await goalRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Goal not found" });
    }

    // Verify goal belongs to user
    const goalData = doc.data();
    if (goalData.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    await goalRef.delete();

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting goal:", error);
    res.status(500).json({ error: "Failed to delete goal" });
  }
};

// ✅ POST break down goal with AI
const breakDownGoal = async (req, res) => {
  try {
    const goalId = req.params.id;
    const userId = req.user?.id || req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: "User authentication required" });
    }

    const goalRef = db.collection("goals").doc(goalId);
    const doc = await goalRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const goalData = doc.data();

    // Verify goal belongs to user
    if (goalData.userId !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    console.log('🧠 Breaking down goal with AI:', goalData.title);

    // Generate AI-powered tasks based on goal details
    const generatedTasks = await generateAITasks(
      goalData.title,
      goalData.description,
      goalData.category,
      goalData.targetDate
    );

    // Update goal with generated subtasks
    const subtasks = generatedTasks.map(task => task.title);
    const totalTasks = subtasks.length;

    await goalRef.update({
      subtasks: subtasks,
      totalTasks: totalTasks,
      updatedAt: new Date()
    });

    // Get updated goal
    const updatedDoc = await goalRef.get();
    const updatedGoalData = updatedDoc.data();
    const updatedGoal = {
      id: updatedDoc.id,
      ...updatedGoalData,
      createdAt: updatedGoalData.createdAt?.toDate?.() || updatedGoalData.createdAt,
      targetDate: updatedGoalData.targetDate?.toDate?.() || updatedGoalData.targetDate,
      updatedAt: updatedGoalData.updatedAt?.toDate?.() || updatedGoalData.updatedAt,
    };

    console.log('✅ Goal broken down successfully with', generatedTasks.length, 'tasks');

    res.status(200).json({
      goal: updatedGoal,
      generatedTasks: generatedTasks,
      message: `Goal broken down into ${generatedTasks.length} actionable tasks!`
    });

  } catch (error) {
    console.error("❌ Error breaking down goal:", error);
    res.status(500).json({ error: "Failed to break down goal" });
  }
};

// ✅ POST create tasks from goal breakdown
const createTasksFromGoal = async (req, res) => {
  try {
    const goalId = req.params.id;
    const userId = req.user?.id || req.headers['x-user-id'];

    console.log(`🎯 Creating tasks for goal ${goalId} by user ${userId}`);

    if (!userId) {
      return res.status(401).json({ error: "User authentication required" });
    }

    const goalRef = db.collection("goals").doc(goalId);
    const doc = await goalRef.get();

    if (!doc.exists) {
      console.log(`❌ Goal ${goalId} not found`);
      return res.status(404).json({ error: "Goal not found" });
    }

    const goalData = doc.data();
    console.log(`📋 Goal data:`, goalData);

    // Verify goal belongs to user
    if (goalData.userId !== userId) {
      console.log(`❌ Access denied for goal ${goalId}`);
      return res.status(403).json({ error: "Access denied" });
    }

    if (!goalData.subtasks || goalData.subtasks.length === 0) {
      console.log(`❌ Goal ${goalId} has no subtasks`);
      return res.status(400).json({ error: "Goal must be broken down first" });
    }

    const createdTasks = [];
    console.log(`📝 Creating tasks from ${goalData.subtasks.length} subtasks`);

    // Create tasks for each subtask
    for (const subtask of goalData.subtasks) {
      try {
        const taskData = {
          title: subtask,
          description: `Task for goal: ${goalData.title}`,
          priority: goalData.priority,
          category: goalData.category,
          dueDate: goalData.targetDate ? new Date(goalData.targetDate).toISOString().split('T')[0] : null,
          goalId: goalId,
          userId,
          completed: false,
          status: "pending",
          createdAt: new Date(),
          completedAt: null,
          lastCompletedAt: null,
          completedDates: [],
          reminders: { before: 15 },
          calendarEventId: null
        };

        console.log(`🔄 Creating task: ${taskData.title}`);
        
        // Create task directly in Firestore
        const taskRef = await db.collection("tasks").add(taskData);
        
        console.log(`✅ Created task: ${taskData.title} with ID: ${taskRef.id}`);

        createdTasks.push({
          id: taskRef.id,
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          category: taskData.category,
          dueDate: taskData.dueDate,
          goalId: taskData.goalId
        });
      } catch (taskError) {
        console.error(`❌ Failed to create task for subtask: ${subtask}`, taskError);
      }
    }

    // Update goal progress
    await goalRef.update({
      updatedAt: new Date()
    });

    console.log(`✅ Successfully created ${createdTasks.length} tasks from goal: ${goalData.title}`);
    console.log(`📋 Created tasks:`, createdTasks);
    
    res.status(201).json({
      message: `Created ${createdTasks.length} tasks from goal breakdown`,
      tasks: createdTasks,
      goalId: goalId
    });

  } catch (error) {
    console.error("❌ Error creating tasks from goal:", error);
    res.status(500).json({ error: "Failed to create tasks from goal" });
  }
};

// ✅ GET goal statistics
const getGoalStats = async (req, res) => {
  try {
    const userId = req.user?.id || req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ error: "User authentication required" });
    }

    const snapshot = await db.collection("goals")
      .where("userId", "==", userId)
      .get();

    let activeGoals = 0;
    let completedGoals = 0;
    let totalProgress = 0;
    let totalTasks = 0;

    snapshot.forEach(doc => {
      const goal = doc.data();
      if (goal.status === 'active') activeGoals++;
      if (goal.status === 'completed') completedGoals++;
      totalProgress += goal.progress || 0;
      totalTasks += goal.totalTasks || 0;
    });

    const avgProgress = snapshot.size > 0 ? Math.round(totalProgress / snapshot.size) : 0;

    const stats = {
      totalGoals: snapshot.size,
      activeGoals,
      completedGoals,
      avgProgress,
      totalTasks
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("❌ Error fetching goal stats:", error);
    res.status(500).json({ error: "Failed to fetch goal statistics" });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  breakDownGoal,
  createTasksFromGoal,
  getGoalStats
};
