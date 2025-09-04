/**
 * Advanced AI Prioritization Service
 * Production-ready scoring system with explainability
 */

class AdvancedPrioritizationService {
  constructor() {
    // Configurable weights - can be personalized per user
    this.weights = {
      urgency: 0.33,
      importance: 0.28,
      timing: 0.15,
      effort: 0.12,
      history: 0.12
    };
    
    // Configuration constants
    this.urgencyWindowHours = 72; // 3 days default urgency window
    this.maxEffortMinutes = 120; // 2 hours = heavy task
    this.postponePenaltyRate = 0.4;
  }

  /**
   * Main scoring function
   * @param {Object} task - Task object
   * @param {Date} now - Current timestamp
   * @param {Object} userContext - User behavior context
   * @param {number} mlAdjustment - ML model adjustment (-0.15 to +0.15)
   * @returns {Object} - Score with breakdown
   */
  calculateScore(task, now = new Date(), userContext = {}, mlAdjustment = 0) {
    const components = {
      urgency: this.calculateUrgencyScore(task, now),
      importance: this.calculateImportanceScore(task),
      timing: this.calculateTimingScore(task, userContext, now),
      effort: this.calculateEffortScore(task),
      history: this.calculateHistoryScore(task)
    };

    // Calculate base score
    const baseScore = 
      this.weights.urgency * components.urgency +
      this.weights.importance * components.importance +
      this.weights.timing * components.timing +
      this.weights.effort * components.effort +
      this.weights.history * components.history;

    // Apply multipliers
    const behaviorMultiplier = this.calculateBehaviorMultiplier(userContext);
    const contextMultiplier = this.calculateContextMultiplier(task, userContext);

    // Final score calculation
    const finalScore = this.clamp(
      baseScore * behaviorMultiplier * contextMultiplier + mlAdjustment,
      0,
      1
    );

    return {
      finalScore,
      baseScore,
      components,
      multipliers: {
        behavior: behaviorMultiplier,
        context: contextMultiplier,
        mlAdjustment
      },
      explanation: this.generateExplanation(components, finalScore, task)
    };
  }

  /**
   * Calculate urgency score based on deadline proximity
   */
  calculateUrgencyScore(task, now) {
    if (!task.dueDate) return 0.0;

    const deadline = new Date(task.dueDate);
    const hoursLeft = (deadline - now) / (1000 * 60 * 60);

    if (hoursLeft <= 0) return 1.0; // Overdue = maximum urgency

    // Use exponential decay for urgency
    const urgencyRatio = Math.max(0, 1 - (hoursLeft / this.urgencyWindowHours));
    
    // Add deadline type consideration
    const deadlineMultiplier = task.due_type === 'hard' ? 1.2 : 1.0;
    
    return this.clamp(urgencyRatio * deadlineMultiplier, 0, 1);
  }

  /**
   * Calculate importance score
   */
  calculateImportanceScore(task) {
    let importance = task.importance || this.inferImportance(task);
    
    // Normalize to 0-1 scale
    if (importance > 10) importance = importance / 100; // Handle percentage scale
    if (importance > 1) importance = importance / 10; // Handle 1-10 scale
    
    return this.clamp(importance, 0, 1);
  }

  /**
   * Infer importance from task properties when not explicitly set
   */
  inferImportance(task) {
    let score = 0.5; // Default medium importance

    // Category-based importance
    const categoryScores = {
      'Work': 0.8,
      'Academic': 0.7,
      'Personal': 0.4
    };
    score = categoryScores[task.category] || score;

    // Priority-based adjustment
    const priorityScores = {
      'High': 0.9,
      'Medium': 0.6,
      'Low': 0.3
    };
    score = Math.max(score, priorityScores[task.priority] || 0.6);

    // Description complexity indicates importance
    if (task.description && task.description.length > 100) {
      score += 0.1;
    }

    return this.clamp(score, 0, 1);
  }

  /**
   * Calculate timing score based on current time and user preferences
   */
  calculateTimingScore(task, userContext, now) {
    const currentHour = now.getHours();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    
    let score = 0.5; // Default neutral timing

    // Time of day preferences
    if (task.startTime) {
      const taskHour = parseInt(task.startTime.split(':')[0]);
      const timeDiff = Math.abs(currentHour - taskHour);
      
      if (timeDiff <= 1) score = 1.0; // Perfect timing
      else if (timeDiff <= 2) score = 0.8; // Good timing
      else if (timeDiff <= 4) score = 0.6; // Acceptable
      else score = 0.3; // Poor timing
    } else {
      // Use category-based time preferences
      if (task.category === 'Work' && currentHour >= 9 && currentHour <= 17) {
        score = 0.9;
      } else if (task.category === 'Personal' && (currentHour >= 18 || currentHour <= 8)) {
        score = 0.8;
      }
    }

    // Day of week considerations
    if (task.category === 'Work' && (dayOfWeek === 0 || dayOfWeek === 6)) {
      score *= 0.7; // Reduce work task priority on weekends
    }

    // User's productive hours (if available in context)
    if (userContext.productiveHours && userContext.productiveHours.includes(currentHour)) {
      score *= 1.2;
    }

    return this.clamp(score, 0, 1);
  }

  /**
   * Calculate effort score (smaller tasks get higher scores for quick wins)
   */
  calculateEffortScore(task) {
    const estimateMinutes = task.estimateMinutes || this.estimateEffort(task);
    
    // Normalize effort (0 = no effort, 1 = maximum effort)
    const effortNorm = Math.min(estimateMinutes / this.maxEffortMinutes, 1);
    
    // Invert for score (lower effort = higher score for quick wins)
    let score = 1 - effortNorm;
    
    // Add complexity consideration
    const complexity = task.effort_complexity || this.inferComplexity(task);
    if (complexity > 7) score *= 0.9; // Penalize very complex tasks slightly
    
    return this.clamp(score, 0, 1);
  }

  /**
   * Estimate effort from task properties
   */
  estimateEffort(task) {
    const text = ((task.title || '') + ' ' + (task.description || '')).toLowerCase();
    
    // Keyword-based estimation
    const quickKeywords = ['call', 'email', 'buy', 'check', 'review', 'submit', 'send'];
    const mediumKeywords = ['write', 'update', 'fix', 'test', 'organize'];
    const heavyKeywords = ['research', 'analyze', 'create', 'develop', 'design', 'study', 'project'];
    
    if (quickKeywords.some(word => text.includes(word))) return 15;
    if (heavyKeywords.some(word => text.includes(word))) return 90;
    if (mediumKeywords.some(word => text.includes(word))) return 45;
    
    // Default based on description length
    const descLength = (task.description || '').length;
    if (descLength > 200) return 60;
    if (descLength > 100) return 30;
    return 20;
  }

  /**
   * Infer complexity from task content
   */
  inferComplexity(task) {
    const text = ((task.title || '') + ' ' + (task.description || '')).toLowerCase();
    
    const complexIndicators = ['analyze', 'research', 'design', 'develop', 'algorithm', 'system'];
    const simpleIndicators = ['call', 'email', 'buy', 'check'];
    
    if (complexIndicators.some(word => text.includes(word))) return 8;
    if (simpleIndicators.some(word => text.includes(word))) return 3;
    return 5; // Medium complexity
  }

  /**
   * Calculate history score based on user's past behavior with similar tasks
   */
  calculateHistoryScore(task) {
    const timesPostponed = task.timesPostponed || 0;
    const completionRate = task.completion_rate || 0.8; // Default optimistic rate
    
    // Postponement penalty (exponential decay)
    const postponePenalty = Math.exp(-this.postponePenaltyRate * timesPostponed);
    
    // Age penalty for stale tasks
    const createdAt = new Date(task.createdAt || task.created_at || Date.now());
    const daysOld = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);
    const agePenalty = daysOld > 30 ? 0.9 : 1.0; // Slight penalty for month-old tasks
    
    // Combine factors
    const score = 0.4 * postponePenalty + 0.4 * completionRate + 0.2 * agePenalty;
    
    return this.clamp(score, 0, 1);
  }

  /**
   * Calculate behavior multiplier based on user context
   */
  calculateBehaviorMultiplier(userContext) {
    const recentPositiveRatio = userContext.recentPositiveSignalRatio || 0.8;
    const streakBonus = userContext.completionStreak ? Math.min(userContext.completionStreak * 0.02, 0.2) : 0;
    
    return this.clamp(1.0 + 0.1 * recentPositiveRatio + streakBonus, 0.8, 1.3);
  }

  /**
   * Calculate context multiplier for environmental factors
   */
  calculateContextMultiplier(task, userContext) {
    let multiplier = 1.0;
    
    // Device capability matching
    if (task.required_device === 'laptop' && userContext.device === 'mobile') {
      multiplier *= 0.7;
    }
    
    // Location context
    if (task.preferred_location && userContext.location !== task.preferred_location) {
      multiplier *= 0.9;
    }
    
    // Energy level considerations
    if (userContext.energyLevel === 'low' && task.effort_complexity > 7) {
      multiplier *= 0.8;
    }
    
    return this.clamp(multiplier, 0.7, 1.3);
  }

  /**
   * Generate human-readable explanation for the score
   */
  generateExplanation(components, finalScore, task) {
    const topFactors = Object.entries(components)
      .map(([key, value]) => ({ factor: key, value, weighted: value * this.weights[key] }))
      .sort((a, b) => b.weighted - a.weighted)
      .slice(0, 3);

    const reasons = [];
    
    // Primary reason
    const topFactor = topFactors[0];
    if (topFactor.factor === 'urgency' && topFactor.value > 0.7) {
      if (task.dueDate && new Date(task.dueDate) < new Date()) {
        reasons.push("⚠️ Task is overdue and needs immediate attention");
      } else {
        reasons.push("⏰ Deadline is approaching soon");
      }
    } else if (topFactor.factor === 'importance' && topFactor.value > 0.7) {
      reasons.push("🎯 High importance task that impacts your goals");
    } else if (topFactor.factor === 'timing' && topFactor.value > 0.8) {
      reasons.push("⭐ Perfect timing - matches your productive hours");
    } else if (topFactor.factor === 'effort' && topFactor.value > 0.7) {
      reasons.push("⚡ Quick win - low effort, high impact");
    }

    // Secondary reasons
    if (components.urgency > 0.5 && topFactor.factor !== 'urgency') {
      reasons.push("🕒 Time-sensitive deadline");
    }
    if (components.timing > 0.7 && topFactor.factor !== 'timing') {
      reasons.push("🎯 Optimal time to tackle this");
    }
    if (components.effort > 0.8) {
      reasons.push("⚡ Easy to complete quickly");
    }

    return {
      primaryReason: reasons[0] || "📊 Balanced priority based on multiple factors",
      allReasons: reasons,
      scoreBreakdown: topFactors,
      recommendation: this.generateRecommendation(components, task)
    };
  }

  /**
   * Generate timing recommendation
   */
  generateRecommendation(components, task) {
    if (components.urgency > 0.8) {
      return "Start immediately - deadline is critical";
    }
    if (components.timing > 0.8) {
      return "Perfect time to work on this";
    }
    if (components.effort < 0.3) {
      return "Consider breaking this into smaller chunks";
    }
    if (components.importance > 0.8) {
      return "Schedule focused time for this important task";
    }
    return "Good candidate for your next work session";
  }

  /**
   * Utility function to clamp values
   */
  clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }

  /**
   * Batch score multiple tasks
   */
  scoreTasks(tasks, userContext = {}) {
    const now = new Date();
    return tasks.map(task => {
      const scoreData = this.calculateScore(task, now, userContext);
      return {
        ...task,
        aiScore: scoreData.finalScore,
        aiScoreBreakdown: scoreData,
        aiRank: 0, // Will be set after sorting
        aiInsights: {
          priorityReason: scoreData.explanation.primaryReason,
          timeRecommendation: scoreData.explanation.recommendation,
          isUrgent: scoreData.components.urgency > 0.7,
          isOverdue: task.dueDate && new Date(task.dueDate) < now,
          isOptimizedForTime: scoreData.components.timing > 0.7,
          requiresFocus: scoreData.components.effort < 0.3 || scoreData.components.importance > 0.8,
          nlpEnhanced: true
        }
      };
    });
  }

  /**
   * Sort and rank tasks by AI score
   */
  prioritizeTasks(tasks, userContext = {}) {
    const scoredTasks = this.scoreTasks(tasks, userContext);
    
    // Sort by AI score (descending)
    const sortedTasks = scoredTasks.sort((a, b) => b.aiScore - a.aiScore);
    
    // Assign ranks
    sortedTasks.forEach((task, index) => {
      task.aiRank = index + 1;
      task.aiPriority = Math.round((1 - index / sortedTasks.length) * 100); // 100 for top, decreasing
    });

    return sortedTasks;
  }
}

module.exports = AdvancedPrioritizationService;
