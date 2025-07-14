import { BellIcon } from '@heroicons/react/24/outline';

export default function NotificationBell({ count = 0 }) {
  return (
    <div className="relative">
      <BellIcon className="h-6 w-6 text-gray-600" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
          {count}
        </span>
      )}
    </div>
  );
}
