// Calendar service: handles API calls for calendar events
export async function getEvents() {
  // Replace with real API endpoint
  const res = await fetch('/api/calendar');
  return res.json();
}

export async function addEvent(event) {
  // Replace with real API endpoint
  const res = await fetch('/api/calendar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  return res.json();
}
