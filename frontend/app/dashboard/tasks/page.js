
import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import TaskCard from '../../components/TaskCard';
import Modal from '../../components/Modal';

// Mock fetch function (replace with real API call)
const fetchTasks = async () => [
  { id: 1, title: 'Finish hackathon pitch', completed: false },
  { id: 2, title: 'Sync calendar with Google', completed: true },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

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
    setModalOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Tasks</h2>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-1 mb-6"
      >
        <PlusIcon className="h-5 w-5" /> Add Task
      </button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="text-lg font-semibold mb-2">Add New Task</h3>
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Task title..."
          className="w-full border rounded px-3 py-2 mb-4"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Add
        </button>
      </Modal>
      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <ul className="space-y-3">
          {tasks.map(task => (
            <li key={task.id}>
              <TaskCard task={task} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
