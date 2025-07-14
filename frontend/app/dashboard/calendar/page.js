
import Loader from '../../components/Loader';
import useCalendarEvents from '../../hooks/useCalendarEvents';

// Mock fetch function (replace with real API call)
const fetchEvents = async () => [
  { id: 1, title: 'Google Calendar Sync', date: '2025-07-14', time: '10:00 AM' },
  { id: 2, title: 'Team Standup', date: '2025-07-14', time: '2:00 PM' },
];

export default function CalendarPage() {
  const { events, loading } = useCalendarEvents();

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Calendar</h2>
      {loading ? (
        <Loader />
      ) : events.length === 0 ? (
        <div>No events scheduled.</div>
      ) : (
        <ul className="space-y-3">
          {events.map(event => (
            <li key={event.id} className="bg-white p-4 rounded shadow flex flex-col">
              <span className="font-semibold">{event.title}</span>
              <span className="text-gray-500 text-sm">{event.date} &bull; {event.time}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
