import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Calendar, Filter } from 'lucide-react';
import api from '../services/api';

interface StoolLog {
  id: string;
  bristol_type: number;
  color: string;
  consistency: string;
  size: string;
  urgency: number;
  completeness: number;
  blood_present: boolean;
  mucus_present: boolean;
  undigested_food: boolean;
  notes: string | null;
  logged_at: string;
  created_at: string;
}

const StoolHistory = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<StoolLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const { data } = await api.get('/stools');
      setLogs(data.data);
    } catch (error) {
      console.error('Failed to load stool logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this log?')) return;

    try {
      await api.delete(`/stools/${id}`);
      setLogs(logs.filter((log) => log.id !== id));
    } catch (error) {
      console.error('Failed to delete log:', error);
      alert('Failed to delete log');
    }
  };

  const getBristolColor = (type: number) => {
    if (type <= 2) return 'text-red-600';
    if (type <= 4) return 'text-green-600';
    return 'text-orange-600';
  };

  const getBristolLabel = (type: number) => {
    const labels = [
      'Type 1 - Constipated',
      'Type 2 - Constipated',
      'Type 3 - Normal',
      'Type 4 - Ideal',
      'Type 5 - Lacking fiber',
      'Type 6 - Mild diarrhea',
      'Type 7 - Severe diarrhea',
    ];
    return labels[type - 1] || `Type ${type}`;
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

  const extractColorFromNotes = (notes: string | null): string | null => {
    if (!notes) return null;
    // Extract HEX color from notes (format: "Color: #XXXXXX")
    const colorMatch = notes.match(/Color:\s*(#[0-9A-Fa-f]{6})/);
    return colorMatch ? colorMatch[1] : null;
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
              <h1 className="text-2xl font-bold">Stool History</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {filteredLogs.length} logs
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
            <p className="text-gray-500 mb-4">No stool logs found</p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              Log Your First Stool
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`text-3xl font-bold ${getBristolColor(log.bristol_type)}`}>
                        {log.bristol_type}
                      </span>
                      <div>
                        <p className={`font-semibold ${getBristolColor(log.bristol_type)}`}>
                          {getBristolLabel(log.bristol_type)}
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

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Color:</span>
                    {(() => {
                      const hexColor = extractColorFromNotes(log.notes);
                      return hexColor ? (
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                            style={{ backgroundColor: hexColor }}
                            title={hexColor}
                          />
                          <span className="font-mono text-xs font-medium">{hexColor}</span>
                        </div>
                      ) : (
                        <span className="ml-2 font-medium">{log.color || 'N/A'}</span>
                      );
                    })()}
                  </div>
                  <div>
                    <span className="text-gray-500">Consistency:</span>
                    <span className="ml-2 font-medium">{log.consistency || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Size:</span>
                    <span className="ml-2 font-medium">{log.size || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Urgency:</span>
                    <span className="ml-2 font-medium">{log.urgency}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Completeness:</span>
                    <span className="ml-2 font-medium">{log.completeness}/10</span>
                  </div>
                </div>

                {/* Alerts */}
                {(log.blood_present || log.mucus_present || log.undigested_food) && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      {log.blood_present && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded text-xs font-medium">
                          Blood Present
                        </span>
                      )}
                      {log.mucus_present && (
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded text-xs font-medium">
                          Mucus Present
                        </span>
                      )}
                      {log.undigested_food && (
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 rounded text-xs font-medium">
                          Undigested Food
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {log.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{log.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoolHistory;
