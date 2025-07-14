
export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">About TaskTuner</h1>
      <p className="mb-4 text-gray-700">
        TaskTuner is your productivity hub for managing tasks, goals, calendar events, and personal analytics. Built for hackathons and real-world teams, it combines AI-powered planning, Google Calendar sync, and voice features in a modern, secure dashboard.
      </p>
      <ul className="list-disc ml-6 text-gray-600">
        <li>AI-generated goals and tasks</li>
        <li>Google Calendar integration</li>
        <li>Voice roast motivation</li>
        <li>Clerk authentication</li>
        <li>Beautiful analytics and streaks</li>
      </ul>
    </div>
  );
}
