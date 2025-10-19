import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import api from '../services/api';

interface CalendarDay {
  date: string;
  bristolType: number | null;
  logsCount: number;
  hasSymptoms: boolean;
  color: string | null;
}

const Calendar = () => {
  const navigate = useNavigate();
  const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadCalendarData();
  }, [currentDate]);

  const loadCalendarData = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // JS months are 0-indexed
      const { data } = await api.get(`/stats/calendar?year=${year}&month=${month}`);
      setCalendarData(data.data);
    } catch (error) {
      console.error('Failed to load calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBristolColor = (type: number | null) => {
    if (!type) return 'bg-gray-100 dark:bg-gray-800';
    if (type <= 2) return 'bg-red-500';
    if (type <= 4) return 'bg-green-500';
    return 'bg-orange-500';
  };

  const getIntensity = (logsCount: number) => {
    if (logsCount === 0) return 'opacity-10';
    if (logsCount === 1) return 'opacity-40';
    if (logsCount === 2) return 'opacity-70';
    return 'opacity-100';
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get days in current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

  // Create array of all days including leading blanks
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Helper to get data for a specific day
  const getDataForDay = (day: number): CalendarDay | undefined => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarData.find((d) => d.date === dateStr);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-effect shadow-lg sticky top-0 z-30 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 transform hover:scale-110"
                aria-label="Back to dashboard"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="text-2xl">📅</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Activity Calendar
              </h1>
            </div>
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <CalendarIcon size={24} className="text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* Month Navigation */}
        <div className="card mb-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="p-3 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-xl transition-all duration-200 transform hover:scale-110"
              aria-label="Previous month"
            >
              <ChevronLeft size={24} className="text-primary-600 dark:text-primary-400" />
            </button>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              {monthName}
            </h2>
            <button
              onClick={nextMonth}
              className="p-3 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-xl transition-all duration-200 transform hover:scale-110"
              aria-label="Next month"
            >
              <ChevronRight size={24} className="text-primary-600 dark:text-primary-400" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-bold text-gray-600 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-3">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const dayData = getDataForDay(day);
                const hasData = dayData && dayData.logsCount > 0;
                const isToday =
                  day === new Date().getDate() &&
                  month === new Date().getMonth() &&
                  year === new Date().getFullYear();

                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all duration-300 transform shadow-sm ${
                      hasData
                        ? `${getBristolColor(dayData.bristolType)} ${getIntensity(
                            dayData.logsCount
                          )} cursor-pointer hover:scale-110 hover:shadow-lg`
                        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                    } ${isToday ? 'ring-4 ring-primary-600 ring-offset-2 dark:ring-offset-gray-800' : ''}`}
                    title={
                      hasData
                        ? `${dayData.logsCount} log${dayData.logsCount > 1 ? 's' : ''} ${
                            dayData.bristolType ? `- Type ${dayData.bristolType}` : ''
                          }${dayData.hasSymptoms ? ' - Has symptoms' : ''}`
                        : 'No logs'
                    }
                  >
                    <div
                      className={`text-base font-bold ${
                        hasData ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {day}
                    </div>
                    {hasData && (
                      <div className="text-xs text-white font-bold mt-1 px-2 py-0.5 bg-black/20 rounded-full">
                        {dayData.logsCount}
                      </div>
                    )}
                    {dayData?.hasSymptoms && (
                      <div className="text-xs mt-1">⚠️</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="card animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center space-x-2 mb-5">
            <div className="text-2xl">🎨</div>
            <h3 className="text-lg font-bold">Legend</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-green-500 shadow-md" />
              <span className="font-medium">Ideal (Bristol Type 3-4)</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-red-500 shadow-md" />
              <span className="font-medium">Constipated (Bristol Type 1-2)</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500 shadow-md" />
              <span className="font-medium">Loose (Bristol Type 5-7)</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600" />
              <span className="font-medium">No logs</span>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t-2 border-gray-100 dark:border-gray-700">
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Intensity</p>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-green-500 opacity-40 shadow-sm" />
              <div className="w-8 h-8 rounded-xl bg-green-500 opacity-70 shadow-sm" />
              <div className="w-8 h-8 rounded-xl bg-green-500 opacity-100 shadow-md" />
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">More logs = darker color</span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="card mt-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center space-x-2 mb-5">
            <div className="text-2xl">📈</div>
            <h3 className="text-lg font-bold">Month Summary</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-xl">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Total Logs</p>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {calendarData.reduce((sum, day) => sum + day.logsCount, 0)}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Days Logged</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {calendarData.filter((day) => day.logsCount > 0).length}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Avg Bristol Type</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {calendarData.filter((d) => d.bristolType !== null).length > 0
                  ? (
                      calendarData
                        .filter((d) => d.bristolType !== null)
                        .reduce((sum, d) => sum + (d.bristolType || 0), 0) /
                      calendarData.filter((d) => d.bristolType !== null).length
                    ).toFixed(1)
                  : 'N/A'}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Days with Symptoms</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {calendarData.filter((day) => day.hasSymptoms).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
