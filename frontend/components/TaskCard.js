export default function TaskCard({ task }) {
  return (
    <div className="bg-white p-4 rounded shadow flex items-center justify-between">
      <span className={task.completed ? 'line-through text-gray-400' : ''}>{task.title}</span>
      <span className={task.completed ? 'text-green-500' : 'text-yellow-500'}>
        {task.completed ? 'Done' : 'Pending'}
      </span>
    </div>
  );
}
