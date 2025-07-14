import { useState, useEffect } from 'react';
import { getAnalytics } from '../services/analyticsService';

export default function useStreaks() {
  const [streaks, setStreaks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then(data => {
      setStreaks(data.streaks || []);
      setLoading(false);
    });
  }, []);

  return { streaks, loading };
}
