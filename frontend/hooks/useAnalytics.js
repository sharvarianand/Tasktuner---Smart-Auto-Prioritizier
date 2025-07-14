import { useState, useEffect } from 'react';
import { getAnalytics } from '../services/analyticsService';

export default function useAnalytics() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then(data => {
      setStats(data.stats || []);
      setLoading(false);
    });
  }, []);

  return { stats, loading };
}
