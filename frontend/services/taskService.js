// Task service: handles API calls for tasks
export async function getTasks() {
  // Replace with real API endpoint
  const res = await fetch('/api/tasks');
  return res.json();
}

export async function addTask(task) {
  // Replace with real API endpoint
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return res.json();
}
