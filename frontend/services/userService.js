// User service: handles API calls for user data
export async function getUser() {
  // Replace with real API endpoint
  const res = await fetch('/api/user');
  return res.json();
}
