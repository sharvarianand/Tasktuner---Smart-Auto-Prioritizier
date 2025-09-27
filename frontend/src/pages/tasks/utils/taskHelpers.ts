export const isTaskOverdue = (task: any) => {
  if (task?.completed || task?.cancelled || !task?.dueDate) return false;
  const now = new Date();
  const dueDateTime = task.endTime
    ? new Date(`${task.dueDate}T${task.endTime}`)
    : new Date(`${task.dueDate}T23:59:59`);
  return now > dueDateTime;
};

export const getTaskCardClass = (
  task: any,
  isOverdue: boolean,
  isAIMode: boolean,
  index: number
) => {
  const baseClass = "transition-all duration-500 hover:shadow-lg";

  if (task.completed) return `${baseClass} opacity-60`;
  if (isOverdue) return `${baseClass} border-red-200 bg-red-50/30`;
  if (isAIMode && task.aiInsights?.isUrgent)
    return `${baseClass} border-red-300 bg-red-50/50`;
  if (isAIMode && index === 0)
    return `${baseClass} border-purple-300 bg-purple-50/50 ring-2 ring-purple-200`;
  if (isAIMode && index < 3) return `${baseClass} border-blue-200 bg-blue-50/30`;

  return baseClass;
};




