
import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import Modal from '../../components/Modal';

// Mock fetch function (replace with real API call)
const fetchGoals = async () => [
  { id: 1, title: 'Launch MVP', completed: false },
  { id: 2, title: 'Get 100 users', completed: false },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchGoals().then(data => {
      setGoals(data);
      setLoading(false);
    });
  }, []);

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;
    setGoals(prev => [
      ...prev,
      { id: Date.now(), title: newGoal, completed: false }
    ]);
    setNewGoal('');
    setModalOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Goals</h2>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-1 mb-6"
      >
        <PlusIcon className="h-5 w-5" /> Add Goal
      </button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="text-lg font-semibold mb-2">Add New Goal</h3>
        <input
          type="text"
          value={newGoal}
          onChange={e => setNewGoal(e.target.value)}
          placeholder="Goal title..."
          className="w-full border rounded px-3 py-2 mb-4"
        />
        <button
          onClick={handleAddGoal}
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          Add
        </button>
      </Modal>
      {loading ? (
        <div>Loading goals...</div>
      ) : (
        <ul className="space-y-3">
          {goals.map(goal => (
            <li key={goal.id} className="flex items-center justify-between bg-white p-4 rounded shadow">
              <span className={goal.completed ? 'line-through text-gray-400' : ''}>{goal.title}</span>
              <span className={goal.completed ? 'text-green-500' : 'text-yellow-500'}>
                {goal.completed ? 'Achieved' : 'Active'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
