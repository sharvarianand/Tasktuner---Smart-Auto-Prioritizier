export const OverdueAlert = ({ tasks, onViewTasks }: { tasks: any[]; onViewTasks: () => void; }) => {
  const overdue = tasks.filter((t) => !t.completed && t.dueDate && new Date() > new Date(`${t.dueDate}T${t.endTime || "23:59:59"}`));
  if (overdue.length === 0) return null;

  return (
    <div className="rounded-md border border-yellow-300 bg-yellow-50 text-yellow-800 px-3 py-2 text-sm">
      You have {overdue.length} overdue task{overdue.length > 1 ? "s" : ""}.{' '}
      <button className="underline" onClick={onViewTasks}>View</button>
    </div>
  );
};





