import { useState, useEffect } from 'react';
import { getEvents } from '../services/calendarService';

export default function useCalendarEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  return { events, loading };
}
