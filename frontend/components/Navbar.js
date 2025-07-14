import { UserButton } from '@clerk/nextjs';

export default function Navbar() {
  return (
    <header className="w-full h-16 bg-gray-800 flex items-center justify-between px-6 shadow">
      <div className="text-lg font-semibold text-white">Dashboard</div>
      <UserButton afterSignOutUrl="/auth/sign-in" />
    </header>
  );
}
