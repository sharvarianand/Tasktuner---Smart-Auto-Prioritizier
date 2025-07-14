import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

const navItems = [
  { name: 'Analytics', path: '/dashboard/analytics' },
  { name: 'Calendar', path: '/dashboard/calendar' },
  { name: 'Goals', path: '/dashboard/goals' },
  { name: 'Tasks', path: '/dashboard/tasks' },
  { name: 'Settings', path: '/dashboard/settings' },
];

export default function Sidebar() {
  const { user } = useUser();
  return (
    <aside className="h-full w-64 bg-gray-900 text-white flex flex-col p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">TaskTuner</h2>
        {user && <p className="text-sm mt-2">Hi, {user.firstName}</p>}
      </div>
      <nav className="flex-1">
        <ul className="space-y-4">
          {navItems.map(item => (
            <li key={item.path}>
              <Link href={item.path} className="hover:text-blue-400 transition">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
