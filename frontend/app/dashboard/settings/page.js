
import { UserProfile } from '@clerk/nextjs';
import useUserData from '../../hooks/useUserData';

export default function SettingsPage() {
  const { user, loading } = useUserData();
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <div className="bg-white p-6 rounded shadow">
        <UserProfile />
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Profile Info (from backend)</h3>
          {loading ? (
            <div>Loading profile...</div>
          ) : user ? (
            <div>
              <div><strong>Name:</strong> {user.name}</div>
              <div><strong>Email:</strong> {user.email}</div>
            </div>
          ) : (
            <div>No user data found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
