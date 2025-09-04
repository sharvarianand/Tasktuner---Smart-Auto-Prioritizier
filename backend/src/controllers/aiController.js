const openai = require('../config/openai');
const AdvancedAIPrioritizationService = require('../services/advancedAIService');

// Initialize the advanced AI service
const advancedAI = new AdvancedAIPrioritizationService();

// Self-learning AI prioritization system
class SelfLearningAIPrioritizer {
  constructor() {
    this.userPatterns = new Map(); // Store user behavior patterns
    this.taskSuccessRates = new Map(); // Track task completion success rates
    this.timeEfficiencyData = new Map(); // Track time-of-day efficiency
    this.categoryPerformance = new Map(); // Track category-specific performance
    this.adaptiveWeights = {
      urgency: 0.35,
      impact: 0.25,
      complexity: 0.20,
      context: 0.15,
      timeAwareness: 0.05
    };
  }

  // Learn from user behavior and adjust weights
  learnFromUserBehavior(userId, taskHistory, completedTasks) {
    if (!this.userPatterns.has(userId)) {
      this.userPatterns.set(userId, {
        preferredTimes: new Map(),
        categoryEfficiency: new Map(),
        complexityPreference: new Map(),
        urgencyResponse: new Map(),
        lastUpdated: new Date()
      });
    }

    const userPattern = this.userPatterns.get(userId);
    
    // Analyze completion patterns by time of day
    completedTasks.forEach(task => {
      if (task.completedAt) {
        const completionHour = new Date(task.completedAt).getHours();
        const timeKey = `${completionHour}-${completionHour + 1}`;
        userPattern.preferredTimes.set(timeKey, (userPattern.preferredTimes.get(timeKey) || 0) + 1);
      }
    });

    // Analyze category performance
    completedTasks.forEach(task => {
      const category = task.category;
      const success = task.completed ? 1 : 0;
      const current = userPattern.categoryEfficiency.get(category) || { completed: 0, total: 0 };
      userPattern.categoryEfficiency.set(category, {
        completed: current.completed + success,
        total: current.total + 1,
        rate: (current.completed + success) / (current.total + 1)
      });
    });

    // Analyze complexity preference
    completedTasks.forEach(task => {
      const complexity = this.calculateTaskComplexity(task);
      const success = task.completed ? 1 : 0;
      const current = userPattern.complexityPreference.get(complexity) || { completed: 0, total: 0 };
      userPattern.complexityPreference.set(complexity, {
        completed: current.completed + success,
        total: current.total + 1,
        rate: (current.completed + success) / (current.total + 1)
      });
    });

    // Update adaptive weights based on user patterns
    this.updateAdaptiveWeights(userPattern);
    
    userPattern.lastUpdated = new Date();
  }

  // Calculate task complexity score
  calculateTaskComplexity(task) {
    const description = (task.description || '').toLowerCase();
    const title = (task.title || '').toLowerCase();
    const text = title + ' ' + description;
    
    let complexity = 50; // Base complexity
    
    // High complexity indicators
    const complexKeywords = ['research', 'analyze', 'create', 'develop', 'design', 'write', 'study', 'learn', 'plan', 'organize', 'build', 'implement', 'solve', 'investigate'];
    const simpleKeywords = ['call', 'email', 'buy', 'pick up', 'check', 'review', 'submit', 'send', 'confirm', 'verify'];
    
    const complexCount = complexKeywords.filter(word => text.includes(word)).length;
    const simpleCount = simpleKeywords.filter(word => text.includes(word)).length;
    
    if (complexCount > 0) complexity += Math.min(complexCount * 10, 30);
    if (simpleCount > 0) complexity -= Math.min(simpleCount * 8, 25);
    
    // Adjust based on estimated time
    if (task.estimatedMinutes) {
      if (task.estimatedMinutes <= 15) complexity -= 15;
      else if (task.estimatedMinutes >= 120) complexity += 20;
    }
    
    return Math.max(10, Math.min(100, complexity));
  }

  // Update adaptive weights based on user patterns
  updateAdaptiveWeights(userPattern) {
    // Adjust weights based on user's time efficiency
    const timeEfficiency = this.calculateTimeEfficiency(userPattern.preferredTimes);
    if (timeEfficiency > 0.7) {
      this.adaptiveWeights.timeAwareness = Math.min(0.10, this.adaptiveWeights.timeAwareness + 0.01);
    } else if (timeEfficiency < 0.3) {
      this.adaptiveWeights.timeAwareness = Math.max(0.02, this.adaptiveWeights.timeAwareness - 0.01);
    }

    // Adjust weights based on category performance
    const categoryEfficiency = this.calculateCategoryEfficiency(userPattern.categoryEfficiency);
    if (categoryEfficiency > 0.8) {
      this.adaptiveWeights.context = Math.min(0.20, this.adaptiveWeights.context + 0.01);
    } else if (categoryEfficiency < 0.5) {
      this.adaptiveWeights.context = Math.max(0.10, this.adaptiveWeights.context - 0.01);
    }

    // Normalize weights to sum to 1
    const totalWeight = Object.values(this.adaptiveWeights).reduce((sum, weight) => sum + weight, 0);
    Object.keys(this.adaptiveWeights).forEach(key => {
      this.adaptiveWeights[key] = this.adaptiveWeights[key] / totalWeight;
    });
  }

  // Calculate time efficiency score
  calculateTimeEfficiency(preferredTimes) {
    if (preferredTimes.size === 0) return 0.5;
    
    const totalCompletions = Array.from(preferredTimes.values()).reduce((sum, count) => sum + count, 0);
    const peakHours = Array.from(preferredTimes.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .reduce((sum, [,count]) => sum + count, 0);
    
    return peakHours / totalCompletions;
  }

  // Calculate category efficiency score
  calculateCategoryEfficiency(categoryEfficiency) {
    if (categoryEfficiency.size === 0) return 0.5;
    
    const rates = Array.from(categoryEfficiency.values()).map(cat => cat.rate);
    return rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
  }

  // Get personalized task score with adaptive weights
  getPersonalizedScore(task, userId, baseScores) {
    const userPattern = this.userPatterns.get(userId);
    if (!userPattern) return baseScores;

    let personalizedScore = 0;
    
    // Apply adaptive weights
    personalizedScore += baseScores.urgency * this.adaptiveWeights.urgency;
    personalizedScore += baseScores.impact * this.adaptiveWeights.impact;
    personalizedScore += baseScores.complexity * this.adaptiveWeights.complexity;
    personalizedScore += baseScores.context * this.adaptiveWeights.context;
    personalizedScore += baseScores.timeAwareness * this.adaptiveWeights.timeAwareness;

    // Apply user-specific adjustments
    const timeKey = `${new Date().getHours()}-${new Date().getHours() + 1}`;
    const timePreference = userPattern.preferredTimes.get(timeKey) || 0;
    if (timePreference > 5) {
      personalizedScore += 10; // Boost for preferred time slots
    }

    // Category preference adjustment
    const categoryPerf = userPattern.categoryEfficiency.get(task.category);
    if (categoryPerf && categoryPerf.rate > 0.7) {
      personalizedScore += 8; // Boost for high-performing categories
    }

    // Complexity preference adjustment
    const complexity = this.calculateTaskComplexity(task);
    const complexityPerf = userPattern.complexityPreference.get(Math.floor(complexity / 10) * 10);
    if (complexityPerf && complexityPerf.rate > 0.6) {
      personalizedScore += 5; // Boost for preferred complexity levels
    }

    return Math.min(100, Math.max(0, personalizedScore));
  }
}

// Initialize the self-learning AI prioritizer
const aiPrioritizer = new SelfLearningAIPrioritizer();

//  AI: PRIORITIZE TASKS WITH ADVANCED SELF-LEARNING ALGORITHM
const prioritizeTasks = async (req, res) => {
  try {
    const { tasks, userId = 'demo-user', userContext = {} } = req.body;

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ error: "Tasks array is required" });
    }

    console.log('🧠 Starting SELF-LEARNING AI prioritization for', tasks.length, 'tasks');

    // Early return for empty tasks
    if (tasks.length === 0) {
      return res.status(200).json({
        prioritizedTasks: [],
        insights: { summary: "No tasks to prioritize" }
      });
    }

    // Early return for single task
    if (tasks.length === 1) {
      const task = tasks[0];
      return res.status(200).json({
        prioritizedTasks: [{
          ...task,
          aiPriority: 100,
          aiRank: 1,
          aiInsights: { isUrgent: true, priorityReason: "Only task available" }
        }],
        insights: { summary: "Single task prioritized" }
      });
    }

    // Learn from user behavior if we have historical data
    if (userContext.history && userContext.history.length > 0) {
      aiPrioritizer.learnFromUserBehavior(userId, userContext.history, userContext.completedTasks || []);
    }

    // Phase 1: Enhanced task analysis with self-learning scoring
    const enhancedTasks = await Promise.all(tasks.map(async task => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      let urgencyScore = 0;
      let impactScore = 0;
      let complexityScore = 0;
      let contextScore = 0;
      let timeAwarenessScore = 0;

      // ⏰ CRITICAL TIME-OF-DAY ANALYSIS
      const workDayStart = 6;  // 6 AM - reasonable work day start
      const workDayEnd = 22;   // 10 PM - reasonable work day end
      const currentTimeInHours = currentHour + (currentMinute / 60);
      const remainingWorkHours = Math.max(0, workDayEnd - currentTimeInHours);
      
      console.log(`⏰ Time Analysis: Current time ${currentHour}:${currentMinute.toString().padStart(2, '0')}, Remaining work hours: ${remainingWorkHours.toFixed(1)}`);

      // 1. ADVANCED URGENCY ANALYSIS (Time-sensitive + Date-sensitive + DAY-TIME AWARE)
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        
        // If task has endTime, use it for more precise deadline
        let actualDeadline = dueDate;
        if (task.dueDate === now.toISOString().split('T')[0] && task.endTime) {
          actualDeadline = new Date(`${task.dueDate}T${task.endTime}`);
        }
        
        // Calculate time until due (in minutes for precision)
        const minutesUntilDue = Math.ceil((actualDeadline - now) / (1000 * 60));
        const hoursUntilDue = minutesUntilDue / 60;
        const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        
        // IMMEDIATE URGENCY (within hours)
        if (minutesUntilDue <= 0) urgencyScore = 100; // Overdue
        else if (minutesUntilDue <= 10) urgencyScore = 98; // Due in 10 minutes!
        else if (minutesUntilDue <= 30) urgencyScore = 96; // Due in 30 minutes
        else if (hoursUntilDue <= 1) urgencyScore = 94; // Due in 1 hour
        else if (hoursUntilDue <= 2) urgencyScore = 92; // Due in 2 hours
        else if (hoursUntilDue <= 4) urgencyScore = 90; // Due in 4 hours
        
        // DAILY URGENCY with TIME AWARENESS
        else if (daysUntilDue === 0) {
          // Due today - prioritize based on remaining day time
          if (remainingWorkHours <= 4) urgencyScore = 86; // Less than 4 hours left today!
          else if (remainingWorkHours <= 8) urgencyScore = 84; // Half day left
          else urgencyScore = 82; // Due today (plenty of time)
        }
        else if (daysUntilDue === 1) urgencyScore = 85; // Due tomorrow
        
        // WEEKLY URGENCY
        else if (daysUntilDue <= 3) urgencyScore = 70; // Due within 3 days
        else if (daysUntilDue <= 7) urgencyScore = 50; // Due within a week
        else if (daysUntilDue <= 14) urgencyScore = 30; // Due within 2 weeks
        else urgencyScore = 10; // More than 2 weeks
      } 
      
      // START TIME URGENCY (for tasks with specific start times) - ENHANCED WITH TIME AWARENESS
      else if (task.startDate && task.startTime) {
        const startDateTime = new Date(`${task.startDate}T${task.startTime}`);
        const minutesUntilStart = Math.ceil((startDateTime - now) / (1000 * 60));
        const startHour = startDateTime.getHours();
        
        if (minutesUntilStart <= 0) urgencyScore = 100; // Should have started
        else if (minutesUntilStart <= 10) urgencyScore = 97; // Starts in 10 minutes!
        else if (minutesUntilStart <= 30) urgencyScore = 95; // Starts in 30 minutes
        else if (minutesUntilStart <= 60) urgencyScore = 93; // Starts in 1 hour
        else if (minutesUntilStart <= 120) urgencyScore = 91; // Starts in 2 hours
        else if (minutesUntilStart <= 240) urgencyScore = 89; // Starts in 4 hours
        
        // TIME-OF-DAY BONUS: Morning tasks (6-10 AM) get priority boost when it's still morning
        else if (startHour >= 6 && startHour <= 10 && currentHour <= 12) {
          urgencyScore = 87; // Morning task, still morning - good timing
        }
        // Evening tasks (after 6 PM) get priority boost when evening approaches
        else if (startHour >= 18 && currentHour >= 15) {
          urgencyScore = 85; // Evening task, afternoon/evening - prepare for it
        }
        else urgencyScore = 75; // Scheduled for later
      } 
      
      else {
        urgencyScore = 20; // No deadline or start time = medium urgency
      }

      // ⏰ TIME-OF-DAY AWARENESS BONUS/PENALTY
      if (task.startTime) {
        const startHour = parseInt(task.startTime.split(':')[0]);
        
        // Morning tasks (6-10 AM) - highest efficiency window
        if (startHour >= 6 && startHour <= 10) {
          if (currentHour <= 10) timeAwarenessScore = 20; // Still morning - perfect timing
          else if (currentHour <= 12) timeAwarenessScore = 10; // Late morning - still good
          else timeAwarenessScore = -5; // Afternoon - missed optimal window
        }
        
        // Midday tasks (11 AM - 2 PM) - moderate efficiency  
        else if (startHour >= 11 && startHour <= 14) {
          if (currentHour >= 11 && currentHour <= 15) timeAwarenessScore = 15; // Right timing
          else timeAwarenessScore = 5;
        }
        
        // Afternoon tasks (3-6 PM) - good for routine work
        else if (startHour >= 15 && startHour <= 18) {
          if (currentHour >= 13 && currentHour <= 18) timeAwarenessScore = 12; // Good timing
          else timeAwarenessScore = 3;
        }
        
        // Evening tasks (7-10 PM) - final push window
        else if (startHour >= 19 && startHour <= 22) {
          if (currentHour >= 17) timeAwarenessScore = 8; // Evening preparation
          else timeAwarenessScore = 0;
        }
      }

      // 🚨 REMAINING DAY CAPACITY CHECK
      let capacityPressure = 0;
      if (remainingWorkHours <= 2) {
        capacityPressure = 25; // Very limited time - prioritize aggressively
      } else if (remainingWorkHours <= 4) {
        capacityPressure = 15; // Limited time - prioritize important tasks
      } else if (remainingWorkHours <= 6) {
        capacityPressure = 8; // Moderate pressure
      } else {
        capacityPressure = 0; // Plenty of time
      }

      // 2. IMPACT/PRIORITY ANALYSIS
      const priorityMap = { 'High': 90, 'Medium': 60, 'Low': 30 };
      impactScore = priorityMap[task.priority] || 60;

      // 3. CATEGORY WEIGHT (some categories are more critical)
      const categoryWeights = { 
        'Work': 85, 
        'Academic': 80, 
        'Personal': 50 
      };
      contextScore = categoryWeights[task.category] || 60;

      // 4. COMPLEXITY ESTIMATION (using the self-learning complexity calculator)
      complexityScore = aiPrioritizer.calculateTaskComplexity(task);

      // 5. DAILY TASK BONUS (recurring tasks get slight priority boost)
      const dailyBonus = task.isDaily ? 15 : 0;

      // 6. COMPLETION TIME ESTIMATION
      let estimatedMinutes = 30; // default
      const text = ((task.title || '') + ' ' + (task.description || '')).toLowerCase();
      if (text.includes('quick') || text.includes('minute')) estimatedMinutes = 15;
      if (text.includes('hour')) estimatedMinutes = 60;
      if (text.includes('day') || text.includes('project')) estimatedMinutes = 240;

      // Phase 2: Advanced AI Analysis Integration
      try {
        const nlpAnalysis = await advancedAI.processTaskNLP(task);
        const riskAnalysis = await advancedAI.predictTaskRisks(task, userContext.history || [], tasks);
        
        // Enhance scores with AI insights
        if (nlpAnalysis.urgencySignals.critical) urgencyScore = Math.min(urgencyScore + 15, 100);
        if (nlpAnalysis.urgencySignals.high) urgencyScore = Math.min(urgencyScore + 8, 100);
        if (nlpAnalysis.impactSignals.high) impactScore = Math.min(impactScore + 10, 100);
        if (nlpAnalysis.effortSignals.quick) complexityScore = Math.max(complexityScore - 20, 10);
        if (nlpAnalysis.effortSignals.complex) complexityScore = Math.min(complexityScore + 15, 100);
        
        // Risk adjustments
        if (riskAnalysis.overrunProbability > 0.7) urgencyScore = Math.min(urgencyScore + 10, 100);
        if (riskAnalysis.userStressLevel > 0.8) {
          // Prefer simpler tasks when stressed
          if (complexityScore < 40) impactScore = Math.min(impactScore + 5, 100);
        }
        
        // Apply time-of-day and capacity pressure adjustments
        const finalUrgency = Math.min(urgencyScore + timeAwarenessScore + capacityPressure, 100);
        
        const baseScores = {
            urgency: finalUrgency,
            baseUrgency: urgencyScore,
            timeAwareness: timeAwarenessScore,
            capacityPressure: capacityPressure,
            remainingWorkHours: remainingWorkHours,
            impact: impactScore,
            context: contextScore,
            complexity: complexityScore,
            dailyBonus: dailyBonus,
            estimatedMinutes: estimatedMinutes,
            aiEnhanced: true,
            nlpConfidence: nlpAnalysis.nlpConfidence,
            riskFactors: riskAnalysis
        };

        // Get personalized score using self-learning algorithm
        const personalizedScore = aiPrioritizer.getPersonalizedScore(task, userId, baseScores);
        
        return {
          ...task,
          scores: {
            ...baseScores,
            personalizedScore: personalizedScore,
            adaptiveWeights: aiPrioritizer.adaptiveWeights
          }
        };
      } catch (aiError) {
        console.log('⚠️ Advanced AI analysis failed, using base scoring:', aiError.message);
        
        // Apply time-of-day and capacity pressure adjustments even without AI
        const finalUrgency = Math.min(urgencyScore + timeAwarenessScore + capacityPressure, 100);
        
        const baseScores = {
            urgency: finalUrgency,
            baseUrgency: urgencyScore,
            timeAwareness: timeAwarenessScore,
            capacityPressure: capacityPressure,
            remainingWorkHours: remainingWorkHours,
            impact: impactScore,
            context: contextScore,
            complexity: complexityScore,
            dailyBonus: dailyBonus,
            estimatedMinutes: estimatedMinutes,
            aiEnhanced: false
        };

        // Get personalized score using self-learning algorithm
        const personalizedScore = aiPrioritizer.getPersonalizedScore(task, userId, baseScores);
        
        return {
          ...task,
          scores: {
            ...baseScores,
            personalizedScore: personalizedScore,
            adaptiveWeights: aiPrioritizer.adaptiveWeights
          }
        };
      }
    }));

    // Phase 3: Create detailed prompt for AI with enhanced scoring context and TIME AWARENESS
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    const remainingWorkHours = Math.max(0, 22 - (now.getHours() + now.getMinutes()/60));
    
    const taskAnalysis = enhancedTasks.map((t, i) => {
      const dueInfo = t.dueDate ? `Due: ${t.dueDate}` : 'No deadline';
      const timeInfo = t.startTime ? `Start: ${t.startTime}` : '';
      const endTimeInfo = t.endTime ? `End: ${t.endTime}` : '';
      const scores = t.scores;
      
      return `${i + 1}. [ID: ${t.id}]
   Title: "${t.title}"
   ${dueInfo} ${timeInfo} ${endTimeInfo} | Priority: ${t.priority} | Category: ${t.category}
   Description: ${t.description || 'No description'}
   ⏰ TIME SCORES - Final Urgency: ${scores.urgency}/100 (Base: ${scores.baseUrgency}, Time Bonus: ${scores.timeAwareness}, Capacity Pressure: ${scores.capacityPressure})
   🧠 PERSONALIZED SCORE: ${scores.personalizedScore}/100 (Self-learning algorithm)
   📊 OTHER SCORES - Impact: ${scores.impact}/100, Context: ${scores.context}/100, Complexity: ${scores.complexity}/100
   ⏱️ Estimated Time: ${scores.estimatedMinutes}min | Daily Task: ${t.isDaily ? 'Yes' : 'No'}
   🔄 ADAPTIVE WEIGHTS - Urgency: ${(scores.adaptiveWeights?.urgency * 100).toFixed(1)}%, Impact: ${(scores.adaptiveWeights?.impact * 100).toFixed(1)}%, Complexity: ${(scores.adaptiveWeights?.complexity * 100).toFixed(1)}%, Context: ${(scores.adaptiveWeights?.context * 100).toFixed(1)}%, Time: ${(scores.adaptiveWeights?.timeAwareness * 100).toFixed(1)}%`;
    }).join('\n\n');

    const prompt = `You are an expert productivity consultant with SELF-LEARNING AI capabilities analyzing tasks at ${currentTime} with ${remainingWorkHours.toFixed(1)} work hours remaining today.

🧠 SELF-LEARNING AI PRIORITIZATION FRAMEWORK:
1. IMMEDIATE TIME URGENCY: Tasks starting/due within minutes = TOP PRIORITY
2. REMAINING DAY CAPACITY: With only ${remainingWorkHours.toFixed(1)} hours left, prioritize realistically completable tasks
3. TIME-OF-DAY EFFICIENCY: Morning tasks (6-10 AM) need morning energy, evening tasks need evening focus
4. COGNITIVE LOAD MANAGEMENT: High complexity when fresh, simple tasks when tired
5. MOMENTUM & FLOW: Group similar tasks, intersperse quick wins
6. PERSONALIZED LEARNING: Each task has a personalized score based on user behavior patterns
7. ADAPTIVE WEIGHTS: The AI automatically adjusts importance of different factors based on user success rates

🎯 PRIORITIZATION RULES:
- Use the personalized score as the primary ranking factor
- Consider time urgency and remaining day capacity
- Balance complexity with available energy
- Group similar tasks for efficiency
- Ensure realistic completion expectations

📊 TASK ANALYSIS:
${taskAnalysis}

🚀 RESPONSE FORMAT:
Return a JSON object with:
1. "prioritizedTasks": Array of tasks sorted by priority (highest first)
2. "insights": Object containing:
   - "summary": Brief explanation of prioritization logic
   - "aiAnalysis": Object with counts of urgent, overdue, time-optimized, and focus-recommended tasks
   - "learningInsights": What the AI learned from this prioritization
   - "adaptiveWeights": Current weight distribution
   - "recommendations": Array of 3 actionable productivity tips

Focus on creating a realistic, achievable task order that maximizes productivity while considering the user's personal patterns and current time constraints.`;

    console.log('🤖 Calling OpenRouter AI for advanced prioritization...');

    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.2, // Lower temperature for more consistent prioritization
    });

    console.log('✅ OpenRouter AI response received');

    const aiOutput = response.choices[0].message.content.trim();
    console.log('🎯 AI Prioritization Output:', aiOutput);
    
    // Parse the AI response (comma-separated task IDs)
    const prioritizedIds = aiOutput.split(',').map(id => id.trim());
    
    // Reorder tasks based on AI prioritization
    const prioritizedTasks = [];
    
    // Add tasks in the order specified by AI
    prioritizedIds.forEach(id => {
      const task = enhancedTasks.find(t => t.id === id);
      if (task) {
        // Clean up the enhanced task (remove scores) before sending back
        const { scores, ...cleanTask } = task;
        prioritizedTasks.push(cleanTask);
      }
    });
    
    // Add any remaining tasks that weren't found (fallback)
    enhancedTasks.forEach(task => {
      if (!prioritizedTasks.find(t => t.id === task.id)) {
        const { scores, ...cleanTask } = task;
        prioritizedTasks.push(cleanTask);
      }
    });

    // Calculate prioritization insights
    const insights = generatePrioritizationInsights(enhancedTasks, prioritizedTasks);

    res.status(200).json({ 
      prioritizedTasks,
      insights,
      note: "Advanced AI prioritization with energy management and cognitive load optimization"
    });

  } catch (error) {
    console.error("❌ Error in advanced prioritization:", error.message);
    console.error("Error details:", error.response?.data || error);

    if (error.status === 401) {
      return res.status(401).json({ error: "OpenRouter authentication failed" });
    }

    if (error.status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded" });
    }

    // Enhanced fallback with our own advanced algorithm
    const fallbackTasks = advancedFallbackPrioritization(req.body.tasks);
    res.status(200).json({
      prioritizedTasks: fallbackTasks,
      note: "Used advanced fallback prioritization (AI unavailable)"
    });
  }
};

// Enhanced insights generation with advanced AI analysis and TIME AWARENESS
const generatePrioritizationInsights = (enhancedTasks, prioritizedTasks) => {
  const insights = [];
  const now = new Date();
  const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  const remainingWorkHours = Math.max(0, 22 - (now.getHours() + now.getMinutes()/60));
  
  // Time awareness summary
  insights.push(`⏰ Current time: ${currentTime} | Remaining work hours: ${remainingWorkHours.toFixed(1)}`);
  
  // Count tasks by urgency (updated thresholds)
  const immediateTasks = enhancedTasks.filter(t => t.scores.urgency >= 98).length;
  const hourlyTasks = enhancedTasks.filter(t => t.scores.urgency >= 94 && t.scores.urgency < 98).length;
  const overdueTasks = enhancedTasks.filter(t => t.scores.urgency === 100).length;
  const todayTasks = enhancedTasks.filter(t => t.scores.urgency >= 88 && t.scores.urgency < 94).length;
  
  if (immediateTasks > 0) {
    insights.push(`🔥 ${immediateTasks} task${immediateTasks > 1 ? 's' : ''} due within minutes - IMMEDIATE priority`);
  }
  
  if (hourlyTasks > 0) {
    insights.push(`⏰ ${hourlyTasks} task${hourlyTasks > 1 ? 's' : ''} due within hours - high priority`);
  }
  
  if (overdueTasks > 0) {
    insights.push(`🚨 ${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''} - critical priority`);
  }
  
  if (todayTasks > 0) {
    insights.push(`📅 ${todayTasks} task${todayTasks > 1 ? 's' : ''} due today - scheduled appropriately`);
  }
  
  // Time-of-day awareness insights
  const timeAwareTasks = enhancedTasks.filter(t => t.scores.timeAwareness > 0).length;
  if (timeAwareTasks > 0) {
    insights.push(`🕐 ${timeAwareTasks} task${timeAwareTasks > 1 ? 's' : ''} optimized for current time of day`);
  }
  
  // Capacity pressure insights
  const pressuredTasks = enhancedTasks.filter(t => t.scores.capacityPressure > 0).length;
  if (pressuredTasks > 0 && remainingWorkHours <= 4) {
    insights.push(`⚡ ${pressuredTasks} task${pressuredTasks > 1 ? 's' : ''} prioritized due to limited remaining time`);
  }
  
  // Specific time-based recommendations
  if (remainingWorkHours <= 2) {
    const shortTasks = enhancedTasks.filter(t => t.scores.estimatedMinutes <= 60).length;
    insights.push(`🎯 With only ${remainingWorkHours.toFixed(1)} hours left, focus on ${shortTasks} task${shortTasks !== 1 ? 's' : ''} under 1 hour`);
  } else if (remainingWorkHours <= 4) {
    insights.push(`📋 Moderate time pressure - prioritize high-impact tasks first`);
  }
  
  // Complexity distribution
  const complexTasks = enhancedTasks.filter(t => t.scores.complexity >= 70).length;
  if (complexTasks > 0) {
    insights.push(`🧠 ${complexTasks} complex task${complexTasks > 1 ? 's' : ''} - scheduled for peak energy`);
  }
  
  // Quick wins
  const quickWins = enhancedTasks.filter(t => t.scores.estimatedMinutes <= 20).length;
  if (quickWins > 0) {
    insights.push(`⚡ ${quickWins} quick win${quickWins > 1 ? 's' : ''} - interspersed for momentum`);
  }
  
  // AI Enhancement status
  const aiEnhancedTasks = enhancedTasks.filter(t => t.scores.aiEnhanced).length;
  if (aiEnhancedTasks > 0) {
    insights.push(`🤖 ${aiEnhancedTasks} task${aiEnhancedTasks > 1 ? 's' : ''} enhanced with NLP analysis`);
  }
  
  // Risk analysis insights
  const highRiskTasks = enhancedTasks.filter(t => 
    t.scores.riskFactors && t.scores.riskFactors.overrunProbability > 0.6
  ).length;
  if (highRiskTasks > 0) {
    insights.push(`⚠️ ${highRiskTasks} task${highRiskTasks > 1 ? 's' : ''} at risk of delays - prioritized`);
  }
  
  // Stress level insights
  const stressedWorkload = enhancedTasks.some(t => 
    t.scores.riskFactors && t.scores.riskFactors.userStressLevel > 0.7
  );
  if (stressedWorkload) {
    insights.push(`😓 High workload detected - simple tasks boosted for momentum`);
  }
  
  return insights;
};

// Advanced fallback prioritization when AI is unavailable
const advancedFallbackPrioritization = (tasks) => {
  return tasks
    .map(task => {
      const now = new Date();
      let score = 0;
      
      // Advanced time-based urgency scoring (same logic as main algorithm)
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const minutesUntilDue = Math.ceil((dueDate - now) / (1000 * 60));
        const hoursUntilDue = minutesUntilDue / 60;
        
        // IMMEDIATE URGENCY (within hours)
        if (minutesUntilDue <= 0) score += 10000; // Overdue
        else if (minutesUntilDue <= 10) score += 9800; // Due in 10 minutes!
        else if (minutesUntilDue <= 30) score += 9600; // Due in 30 minutes
        else if (hoursUntilDue <= 1) score += 9400; // Due in 1 hour
        else if (hoursUntilDue <= 2) score += 9200; // Due in 2 hours
        else if (hoursUntilDue <= 4) score += 9000; // Due in 4 hours
        
        // DAILY URGENCY
        else {
          const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
          if (daysUntilDue === 0) score += 8800; // Due today (but more than 4 hours)
          else if (daysUntilDue === 1) score += 8500; // Due tomorrow
          else if (daysUntilDue <= 3) score += 7000; // Due within 3 days
          else if (daysUntilDue <= 7) score += 5000; // Due within a week
          else score += 1000 / daysUntilDue; // Diminishing urgency
        }
      } 
      
      // START TIME URGENCY (for tasks with specific start times)
      else if (task.startDate && task.startTime) {
        const startDateTime = new Date(`${task.startDate}T${task.startTime}`);
        const minutesUntilStart = Math.ceil((startDateTime - now) / (1000 * 60));
        
        if (minutesUntilStart <= 0) score += 10000; // Should have started
        else if (minutesUntilStart <= 10) score += 9700; // Starts in 10 minutes!
        else if (minutesUntilStart <= 30) score += 9500; // Starts in 30 minutes
        else if (minutesUntilStart <= 60) score += 9300; // Starts in 1 hour
        else if (minutesUntilStart <= 120) score += 9100; // Starts in 2 hours
        else if (minutesUntilStart <= 240) score += 8900; // Starts in 4 hours
        else score += 7500; // Scheduled for later
      }
      
      // Priority scoring
      const priorityScores = { 'High': 200, 'Medium': 100, 'Low': 50 };
      score += priorityScores[task.priority] || 100;
      
      // Category scoring
      const categoryScores = { 'Work': 150, 'Academic': 120, 'Personal': 80 };
      score += categoryScores[task.category] || 100;
      
      // Daily task bonus
      if (task.isDaily) score += 30;
      
      return { ...task, fallbackScore: score };
    })
    .sort((a, b) => b.fallbackScore - a.fallbackScore)
    .map(task => {
      const { fallbackScore, ...cleanTask } = task;
      return cleanTask;
    });
};

// 🔸 Old Fallback sorting logic (kept for compatibility)
const fallbackPrioritization = (tasks) => {
  return tasks
    .sort((a, b) => {
      // Sort by priority first (High=1, Medium=2, Low=3)
      const priorityMap = { 'High': 1, 'Medium': 2, 'Low': 3 };
      const aPriority = priorityMap[a.priority] || 2;
      const bPriority = priorityMap[b.priority] || 2;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // Then sort by due date if priorities are equal
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      
      // Tasks with due dates come first
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      return 0;
    });
};

// 🔹 AI: GENERATE TASKS FROM GOAL
const generateTasksFromGoal = async (req, res) => {
  try {
    const { goal } = req.body;

    if (!goal || goal.trim() === "") {
      return res.status(400).json({ error: "Goal is required" });
    }

    const prompt = `
You are a productivity assistant. Your task is to break the following goal into 8–12 short, structured, action-oriented tasks. Each task must include a "title" and a "priority" (either "high", "medium", or "low").

Only output valid JSON, like this:
[
  { "title": "Create study plan", "priority": "high" },
  { "title": "Revise DSA weekly", "priority": "medium" }
]

Respond only with the JSON. No explanations.

Goal: "${goal}"
`;

    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 350,
      temperature: 0.7,
      stop: ["]"]
    });

    let rawContent = response.choices[0].message.content.trim();
    if (!rawContent.endsWith("]")) {
      rawContent += "]";
    }

    let parsedTasks = [];
    try {
      parsedTasks = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("❌ Failed to parse JSON from AI response:", rawContent);
      return res.status(500).json({ error: "AI response was not valid JSON", raw: rawContent });
    }

    res.status(200).json({ generatedTasks: parsedTasks });

  } catch (error) {
    console.error("❌ Error generating tasks:", error.message);
    res.status(500).json({ error: "Failed to generate tasks from goal" });
  }
};

// 🔹 AI: CONTINUOUS LEARNING FROM USER FEEDBACK
const recordUserFeedback = async (req, res) => {
  try {
    const { userId, taskId, action, context } = req.body;

    if (!userId || !taskId || !action) {
      return res.status(400).json({ error: "userId, taskId, and action are required" });
    }

    console.log(`📚 Recording user feedback: ${userId} performed ${action} on task ${taskId}`);

    // Record the feedback using our advanced AI service
    const userAction = {
      taskId,
      action, // 'completed', 'postponed', 'reordered', 'deleted', 'liked', 'disliked'
      timestamp: new Date(),
      context: context || {}
    };

    const updatedWeights = await advancedAI.updateLearningModel(userId, userAction);

    res.status(200).json({
      message: "Feedback recorded successfully",
      learningWeights: updatedWeights,
      note: "AI prioritization will improve based on your behavior patterns"
    });

  } catch (error) {
    console.error("❌ Error recording feedback:", error.message);
    res.status(500).json({ error: "Failed to record user feedback" });
  }
};

// 🔹 AI: GET CONTEXTUAL SUGGESTIONS
const getContextualSuggestions = async (req, res) => {
  try {
    const { userId, currentContext } = req.body;

    if (!userId || !currentContext) {
      return res.status(400).json({ error: "userId and currentContext are required" });
    }

    console.log(`🎯 Generating contextual suggestions for user ${userId}`);

    const suggestions = await advancedAI.generateContextualSuggestions(userId, currentContext);

    res.status(200).json({
      suggestions,
      note: "Smart suggestions based on your current context and energy level"
    });

  } catch (error) {
    console.error("❌ Error generating suggestions:", error.message);
    res.status(500).json({ error: "Failed to generate contextual suggestions" });
  }
};

// 🔹 AI: ANALYZE USER PATTERNS
const analyzeUserPatterns = async (req, res) => {
  try {
    const { userId, taskHistory } = req.body;

    if (!userId || !taskHistory) {
      return res.status(400).json({ error: "userId and taskHistory are required" });
    }

    console.log(`📊 Analyzing patterns for user ${userId} with ${taskHistory.length} historical tasks`);

    const patterns = await advancedAI.analyzeTaskPatterns(userId, taskHistory);

    res.status(200).json({
      patterns,
      insights: [
        `✅ Success keywords identified: ${patterns.highSuccessKeywords.slice(0, 3).join(', ')}`,
        `⏰ Best performance time: ${patterns.timePreferences.preferredStartHour}:00`,
        `🏆 Top category: ${Object.keys(patterns.categoryPerformance)[0] || 'Work'}`
      ],
      note: "Patterns will be used to personalize future prioritization"
    });

  } catch (error) {
    console.error("❌ Error analyzing patterns:", error.message);
    res.status(500).json({ error: "Failed to analyze user patterns" });
  }
};




module.exports = {
  prioritizeTasks,
  generateTasksFromGoal,
  recordUserFeedback,
  getContextualSuggestions,
  analyzeUserPatterns
};

