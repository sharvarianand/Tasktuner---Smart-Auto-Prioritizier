import { useState, useEffect } from 'react';
import { getUser } from '../services/userService';

export default function useUserData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser().then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  return { user, loading };
}
