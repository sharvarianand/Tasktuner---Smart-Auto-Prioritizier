// Goal service: handles API calls for goals
export async function getGoals() {
  // Replace with real API endpoint
  const res = await fetch('/api/goals');
  return res.json();
}

export async function addGoal(goal) {
  // Replace with real API endpoint
  const res = await fetch('/api/goals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  });
  return res.json();
}
