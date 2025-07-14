
export default function PricingPage() {
  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">Pricing</h1>
      <p className="mb-4 text-gray-700">
        TaskTuner is free for hackathons and personal use. For teams and advanced features, choose a plan below:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2">Free</h2>
          <p className="mb-2">Basic features</p>
          <p className="font-bold text-blue-600">$0</p>
        </div>
        <div className="bg-green-50 p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2">Pro</h2>
          <p className="mb-2">Team analytics, calendar sync, voice roasts</p>
          <p className="font-bold text-green-600">$9/mo</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold mb-2">Enterprise</h2>
          <p className="mb-2">Custom integrations, priority support</p>
          <p className="font-bold text-yellow-600">Contact Us</p>
        </div>
      </div>
    </div>
  );
}
