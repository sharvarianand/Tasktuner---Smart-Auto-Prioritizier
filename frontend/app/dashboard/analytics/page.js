
import Loader from '../../components/Loader';
import useAnalytics from '../../hooks/useAnalytics';

export default function AnalyticsPage() {
  const { stats, loading } = useAnalytics();

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Analytics</h2>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white p-6 rounded shadow text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
