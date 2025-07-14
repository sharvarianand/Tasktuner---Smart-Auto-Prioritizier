
import { UserProfile } from '@clerk/nextjs';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <div className="bg-white p-6 rounded shadow">
        <UserProfile />
      </div>
    </div>
  );
}
