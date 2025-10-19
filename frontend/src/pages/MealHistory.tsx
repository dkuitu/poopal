import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Calendar, Filter, UtensilsCrossed } from 'lucide-react';
import api from '../services/api';

interface MealLog {
  id: string;
  meal_type: string;
  description: string;
  photo_url: string | null;
  ingredients: string | null;
  estimated_fiber_g: number | null;
  estimated_water_ml: number | null;
  logged_at: string;
  created_at: string;
}

const MealHistory = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const { data } = await api.get('/meals');
      setLogs(data.data);
    } catch (error) {
      console.error('Failed to load meal logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meal log?')) return;

    try {
      await api.delete(`/meals/${id}`);
      setLogs(logs.filter((log) => log.id !== id));
    } catch (error) {
      console.error('Failed to delete log:', error);
      alert('Failed to delete log');
    }
  };

  const getMealTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      BREAKFAST: 'text-yellow-600',
      LUNCH: 'text-green-600',
      DINNER: 'text-blue-600',
      SNACK: 'text-purple-600',
    };
    return colors[type] || 'text-gray-600';
  };

  const getMealTypeIcon = (type: string) => {
    return type.charAt(0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const parseIngredients = (ingredientsJson: string | null): string[] => {
    if (!ingredientsJson) return [];
    try {
      return JSON.parse(ingredientsJson);
    } catch {
      return [];
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    const logDate = new Date(log.logged_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));

    if (filter === 'week') return diffDays <= 7;
    if (filter === 'month') return diffDays <= 30;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold">Meal History</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {filteredLogs.length} meals
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* Filter */}
        <div className="card mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Filter size={18} />
            <h3 className="font-semibold">Filter</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'week'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'month'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        {/* Logs List */}
        {filteredLogs.length === 0 ? (
          <div className="card text-center py-12">
            <UtensilsCrossed size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No meal logs found</p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              Log Your First Meal
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => {
              const ingredients = parseIngredients(log.ingredients);

              return (
                <div key={log.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${getMealTypeColor(log.meal_type)} bg-opacity-10`}>
                          {getMealTypeIcon(log.meal_type)}
                        </div>
                        <div>
                          <p className={`font-semibold capitalize ${getMealTypeColor(log.meal_type)}`}>
                            {log.meal_type.toLowerCase()}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(log.logged_at)}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteLog(log.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <p className="text-base font-medium">{log.description}</p>
                  </div>

                  {/* Ingredients */}
                  {ingredients.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">Ingredients:</p>
                      <div className="flex flex-wrap gap-2">
                        {ingredients.map((ingredient, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nutrition Info */}
                  {(log.estimated_fiber_g || log.estimated_water_ml) && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex gap-4 text-sm">
                        {log.estimated_fiber_g && (
                          <div>
                            <span className="text-gray-500">Fiber:</span>
                            <span className="ml-2 font-medium">{log.estimated_fiber_g}g</span>
                          </div>
                        )}
                        {log.estimated_water_ml && (
                          <div>
                            <span className="text-gray-500">Water:</span>
                            <span className="ml-2 font-medium">{log.estimated_water_ml}ml</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealHistory;
