import { useState, useEffect } from 'react';
import { getGoals } from '../services/goalService';

export default function useGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGoals().then(data => {
      setGoals(data);
      setLoading(false);
    });
  }, []);

  return { goals, loading };
}
