import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import api from '../services/api';

interface TrendData {
  date: string;
  bristolType: number | null;
  logsCount: number;
  avgBristolType: number | null;
}

interface WeeklyComparison {
  this_week_bristol: string | null;
  this_week_logs: string | number;
  last_week_bristol: string | null;
  last_week_logs: string | number;
  this_week_symptoms: string | number;
  last_week_symptoms: string | number;
}

const Trends = () => {
  const navigate = useNavigate();
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [weeklyComparison, setWeeklyComparison] = useState<WeeklyComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadData();
  }, [days]);

  const loadData = async () => {
    try {
      const [trendsRes, weeklyRes] = await Promise.all([
        api.get(`/stats/trends?days=${days}`),
        api.get('/stats/weekly-comparison'),
      ]);
      setTrends(trendsRes.data.data);
      setWeeklyComparison(weeklyRes.data.data);
    } catch (error) {
      console.error('Failed to load trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBristolColor = (type: number | null) => {
    if (!type) return '#9CA3AF'; // gray
    if (type <= 2) return '#DC2626'; // red
    if (type <= 4) return '#16A34A'; // green
    return '#F59E0B'; // orange
  };

  const getBristolLabel = (type: number | null) => {
    if (!type) return 'No data';
    if (type <= 2) return 'Constipated';
    if (type <= 4) return 'Ideal';
    return 'Loose';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getChange = (current: string | number | null, previous: string | number | null): string => {
    if (!current || !previous) return 'N/A';
    const curr = typeof current === 'string' ? parseFloat(current) : current;
    const prev = typeof previous === 'string' ? parseFloat(previous) : previous;
    if (isNaN(curr) || isNaN(prev)) return 'N/A';
    const diff = curr - prev;
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff.toFixed(1)}`;
  };

  const getChangeColor = (current: string | number | null, previous: string | number | null): string => {
    if (!current || !previous) return 'text-gray-500';
    const curr = typeof current === 'string' ? parseFloat(current) : current;
    const prev = typeof previous === 'string' ? parseFloat(previous) : previous;
    if (isNaN(curr) || isNaN(prev)) return 'text-gray-500';
    const diff = curr - prev;
    // For Bristol type, closer to 3-4 is better
    if (Math.abs(3.5 - curr) < Math.abs(3.5 - prev)) return 'text-green-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Calculate chart dimensions
  const maxLogs = Math.max(...trends.map((t) => t.logsCount), 1);
  const chartHeight = 200;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold">Trends & Analytics</h1>
            </div>
            <TrendingUp size={24} className="text-primary-600" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* Time Range Filter */}
        <div className="card mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Calendar size={18} />
            <h3 className="font-semibold">Time Range</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setDays(7)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                days === 7
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDays(30)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                days === 30
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setDays(90)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                days === 90
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              90 Days
            </button>
          </div>
        </div>

        {/* Weekly Comparison */}
        {weeklyComparison && (
          <div className="card mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 size={18} />
              <h3 className="font-semibold">This Week vs Last Week</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Avg Bristol Type</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-bold">
                    {weeklyComparison.this_week_bristol
                      ? parseFloat(weeklyComparison.this_week_bristol as string).toFixed(1)
                      : 'N/A'}
                  </p>
                  <span
                    className={`text-sm font-medium ${getChangeColor(
                      weeklyComparison.this_week_bristol,
                      weeklyComparison.last_week_bristol
                    )}`}
                  >
                    {getChange(weeklyComparison.this_week_bristol, weeklyComparison.last_week_bristol)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {getBristolLabel(
                    weeklyComparison.this_week_bristol
                      ? Math.round(parseFloat(weeklyComparison.this_week_bristol as string))
                      : null
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Logs</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-bold">
                    {typeof weeklyComparison.this_week_logs === 'string'
                      ? parseInt(weeklyComparison.this_week_logs)
                      : weeklyComparison.this_week_logs}
                  </p>
                  <span
                    className={`text-sm font-medium ${
                      Number(weeklyComparison.this_week_logs) >= Number(weeklyComparison.last_week_logs)
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {Number(weeklyComparison.this_week_logs) - Number(weeklyComparison.last_week_logs) > 0
                      ? '+'
                      : ''}
                    {Number(weeklyComparison.this_week_logs) - Number(weeklyComparison.last_week_logs)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">logs this week</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Symptoms</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-bold">
                    {typeof weeklyComparison.this_week_symptoms === 'string'
                      ? parseInt(weeklyComparison.this_week_symptoms)
                      : weeklyComparison.this_week_symptoms}
                  </p>
                  <span
                    className={`text-sm font-medium ${
                      Number(weeklyComparison.this_week_symptoms) <=
                      Number(weeklyComparison.last_week_symptoms)
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {Number(weeklyComparison.this_week_symptoms) -
                      Number(weeklyComparison.last_week_symptoms) >
                    0
                      ? '+'
                      : ''}
                    {Number(weeklyComparison.this_week_symptoms) -
                      Number(weeklyComparison.last_week_symptoms)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">reported this week</p>
              </div>
            </div>
          </div>
        )}

        {/* Bristol Type Trend Chart */}
        <div className="card mb-6">
          <h3 className="font-semibold mb-4">Bristol Type Over Time</h3>
          {trends.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No data available for this time range
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Chart Area */}
                <div className="relative" style={{ height: `${chartHeight}px` }}>
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-xs text-gray-500">
                    <span>7</span>
                    <span>6</span>
                    <span>5</span>
                    <span>4</span>
                    <span>3</span>
                    <span>2</span>
                    <span>1</span>
                  </div>

                  {/* Reference lines */}
                  <div className="absolute left-10 right-0 top-0 bottom-0">
                    {[1, 2, 3, 4, 5, 6, 7].map((line) => (
                      <div
                        key={line}
                        className="absolute left-0 right-0 border-t border-gray-200 dark:border-gray-700"
                        style={{ top: `${((7 - line) / 6) * 100}%` }}
                      />
                    ))}

                    {/* Ideal zone (3-4) */}
                    <div
                      className="absolute left-0 right-0 bg-green-100 dark:bg-green-900 opacity-20"
                      style={{
                        top: `${((7 - 4) / 6) * 100}%`,
                        height: `${(1 / 6) * 100}%`,
                      }}
                    />

                    {/* Data points and line */}
                    {trends.filter((t) => t.bristolType !== null).length > 0 && (
                      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke="#6366F1"
                          strokeWidth="2"
                          points={trends
                            .map((t, i) => {
                              if (!t.bristolType) return null;
                              const x = trends.length > 1 ? (i / (trends.length - 1)) * 100 : 50;
                              const y = ((7 - t.bristolType) / 6) * 100;
                              return `${x},${y}`;
                            })
                            .filter((p) => p !== null)
                            .join(' ')}
                        />
                      </svg>
                    )}

                    {/* Data points */}
                    {trends.map((t, i) => {
                      if (!t.bristolType) return null;
                      const x = trends.length > 1 ? (i / (trends.length - 1)) * 100 : 50;
                      const y = ((7 - t.bristolType) / 6) * 100;
                      return (
                        <div
                          key={i}
                          className="absolute w-3 h-3 rounded-full"
                          style={{
                            left: `${x}%`,
                            top: `${y}%`,
                            backgroundColor: getBristolColor(t.bristolType),
                            transform: 'translate(-50%, -50%)',
                          }}
                          title={`${formatDate(t.date)}: Type ${t.bristolType}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="mt-2 ml-10 flex justify-between text-xs text-gray-500">
                  {trends
                    .filter((_, i) => i % Math.ceil(trends.length / 7) === 0)
                    .map((t, i) => (
                      <span key={i}>{formatDate(t.date)}</span>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Daily Logs Count */}
        <div className="card">
          <h3 className="font-semibold mb-4">Daily Activity</h3>
          {trends.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No data available for this time range
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="flex items-end justify-between space-x-1" style={{ height: '150px' }}>
                  {trends.map((t, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end">
                      <div
                        className="w-full bg-primary-600 rounded-t transition-all hover:bg-primary-700"
                        style={{
                          height: `${(t.logsCount / maxLogs) * 100}%`,
                          minHeight: t.logsCount > 0 ? '4px' : '0',
                        }}
                        title={`${formatDate(t.date)}: ${t.logsCount} log${
                          t.logsCount !== 1 ? 's' : ''
                        }`}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  {trends
                    .filter((_, i) => i % Math.ceil(trends.length / 7) === 0)
                    .map((t, i) => (
                      <span key={i}>{formatDate(t.date)}</span>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trends;
