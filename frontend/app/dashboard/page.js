
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function DashboardHome() {
  const { user } = useUser();
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-2">Welcome{user ? `, ${user.firstName}` : ''}!</h2>
      <p className="mb-6 text-gray-600">Your productivity hub is ready. Jump into your tasks, calendar, goals, or analytics below.</p>
      <div className="grid grid-cols-2 gap-6">
        <Link href="/dashboard/tasks" className="bg-blue-100 hover:bg-blue-200 p-6 rounded-lg shadow text-center font-semibold">Tasks</Link>
        <Link href="/dashboard/calendar" className="bg-green-100 hover:bg-green-200 p-6 rounded-lg shadow text-center font-semibold">Calendar</Link>
        <Link href="/dashboard/goals" className="bg-yellow-100 hover:bg-yellow-200 p-6 rounded-lg shadow text-center font-semibold">Goals</Link>
        <Link href="/dashboard/analytics" className="bg-purple-100 hover:bg-purple-200 p-6 rounded-lg shadow text-center font-semibold">Analytics</Link>
      </div>
    </div>
  );
}
