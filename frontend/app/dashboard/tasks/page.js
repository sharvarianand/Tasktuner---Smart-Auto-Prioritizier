
import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';

// Mock fetch function (replace with real API call)
const fetchTasks = async () => [
  { id: 1, title: 'Finish hackathon pitch', completed: false },
  { id: 2, title: 'Sync calendar with Google', completed: true },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks().then(data => {
      setTasks(data);
      setLoading(false);
    });
  }, []);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [
      ...prev,
      { id: Date.now(), title: newTask, completed: false }
    ]);
    setNewTask('');
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      <div className="flex mb-6 gap-2">
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1"
        >
          <PlusIcon className="h-5 w-5" /> Add
        </button>
      </div>
      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <ul className="space-y-3">
          {tasks.map(task => (
            <li key={task.id} className="flex items-center justify-between bg-white p-4 rounded shadow">
              <span className={task.completed ? 'line-through text-gray-400' : ''}>{task.title}</span>
              <span className={task.completed ? 'text-green-500' : 'text-yellow-500'}>
                {task.completed ? 'Done' : 'Pending'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
