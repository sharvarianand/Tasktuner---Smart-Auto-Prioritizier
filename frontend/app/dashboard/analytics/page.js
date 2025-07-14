
import { useState, useEffect } from 'react';
import Loader from '../../components/Loader';

// Mock fetch function (replace with real API call)
const fetchStats = async () => [
  { label: 'Tasks Completed', value: 12 },
  { label: 'Goals Achieved', value: 2 },
  { label: 'Events Scheduled', value: 5 },
];

export default function AnalyticsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Analytics</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white p-6 rounded shadow text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
