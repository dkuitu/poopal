import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Moon,
  Sun,
  Activity,
  Calendar as CalendarIcon,
  TrendingUp,
  Award,
  Plus,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  History,
} from 'lucide-react';
import api from '../services/api';
import StoolLogModal from '../components/StoolLogModal';
import MealLogModal from '../components/MealLogModal';

interface DashboardSummary {
  gutHealthScore: number;
  streakDays: number;
  triggersFound: number;
  achievementsUnlocked: number;
  totalAchievements: number;
  totalLogs: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestedActions?: Array<{
    type: string;
    data?: any;
    buttonText?: string;
  }>;
}

const DashboardNew = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [stoolModalOpen, setStoolModalOpen] = useState(false);
  const [mealModalOpen, setMealModalOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
    loadProactiveInsight();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data } = await api.get('/stats/summary');
      setSummary(data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProactiveInsight = async () => {
    try {
      const { data } = await api.get('/chat/proactive');
      if (data.data) {
        setChatMessages([
          {
            role: 'assistant',
            content: data.data.message,
            suggestedActions: data.data.suggestedActions,
          },
        ]);
        setChatOpen(true); // Auto-open chat if there's a proactive message
      }
    } catch (error) {
      console.error('Failed to load proactive insight:', error);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const { data } = await api.post('/chat', { message: userMessage });
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.data.message,
          suggestedActions: data.data.suggestedActions,
        },
      ]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I had trouble responding. Please try again.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSuggestedAction = async (action: any) => {
    if (action.type === 'add_meal') {
      try {
        const { data } = await api.post('/meals', action.data);
        alert('✅ Meal logged successfully! Check your meal logs.');
        // Refresh dashboard data
        loadDashboardData();
      } catch (error: any) {
        console.error('Failed to add meal:', error);
        alert('Failed to add meal: ' + (error.response?.data?.message || error.message));
      }
    } else if (action.type === 'log_stool') {
      alert('Stool logging feature coming soon!');
    }
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
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-3xl animate-bounce-subtle">💩</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                Poopal
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:inline px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {user?.username || user?.email}
              </span>
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-110"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button
                onClick={logout}
                className="p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-500 transition-all duration-200 transform hover:scale-110"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 lg:py-8">
        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="flex-1">
            {/* Welcome */}
            <div className="mb-8 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                Welcome back! 👋
              </h2>
              <p className="text-gray-600 dark:text-gray-400">Here's your gut health overview</p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
              {/* Gut Health Score */}
              <div className="stat-card animate-slide-up" style={{ animationDelay: '0ms' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Gut Health
                  </h3>
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Activity className="text-primary-600 dark:text-primary-400" size={20} />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {summary?.gutHealthScore || 0}
                </p>
                <p className="text-xs font-medium text-green-600 dark:text-green-500">✓ Looking good!</p>
              </div>

              {/* Streak */}
              <div className="stat-card animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Streak
                  </h3>
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <CalendarIcon className="text-orange-600 dark:text-orange-400" size={20} />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {summary?.streakDays || 0}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">consecutive days</p>
              </div>

              {/* Triggers */}
              <div className="stat-card animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Triggers
                  </h3>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <TrendingUp className="text-purple-600 dark:text-purple-400" size={20} />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {summary?.triggersFound || 0}
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">identified</p>
              </div>

              {/* Achievements */}
              <div className="stat-card animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Badges
                  </h3>
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Award className="text-yellow-600 dark:text-yellow-400" size={20} />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {summary?.achievementsUnlocked || 0}
                  <span className="text-xl text-gray-500 dark:text-gray-400">/{summary?.totalAchievements || 50}</span>
                </p>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">unlocked</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card mb-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center space-x-2 mb-6">
                <div className="text-2xl">⚡</div>
                <h3 className="text-xl font-bold">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <button
                  onClick={() => setStoolModalOpen(true)}
                  className="btn-primary flex items-center justify-center space-x-2 py-4"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Log Stool</span>
                  <span className="sm:hidden">Stool</span>
                </button>
                <button
                  onClick={() => navigate('/stool-history')}
                  className="btn-secondary flex items-center justify-center space-x-2 py-4"
                >
                  <History size={20} />
                  <span className="hidden sm:inline">Stool History</span>
                  <span className="sm:hidden">History</span>
                </button>
                <button
                  onClick={() => setMealModalOpen(true)}
                  className="btn-secondary flex items-center justify-center space-x-2 py-4"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Log Meal</span>
                  <span className="sm:hidden">Meal</span>
                </button>
                <button
                  onClick={() => navigate('/meal-history')}
                  className="btn-secondary flex items-center justify-center space-x-2 py-4"
                >
                  <History size={20} />
                  <span className="hidden sm:inline">Meal History</span>
                  <span className="sm:hidden">Meals</span>
                </button>
                <button
                  onClick={() => alert('Symptom logging feature coming soon!')}
                  className="btn-secondary flex items-center justify-center space-x-2 py-4"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Log Symptom</span>
                  <span className="sm:hidden">Symptom</span>
                </button>
              </div>
            </div>

            {/* Trends & Analytics */}
            <div className="card-interactive mb-6 animate-slide-up" style={{ animationDelay: '500ms' }} onClick={() => navigate('/trends')}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">📊</div>
                  <h3 className="text-xl font-bold">Trends & Analytics</h3>
                </div>
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <ChevronRight className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-5">
                Track your Bristol type trends, weekly comparisons, and daily activity patterns.
              </p>
              <button
                onClick={() => navigate('/trends')}
                className="btn-primary w-full text-base"
              >
                View Trends & Analytics
              </button>
            </div>

            {/* Calendar */}
            <div className="card-interactive animate-slide-up" style={{ animationDelay: '600ms' }} onClick={() => navigate('/calendar')}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="text-2xl">📅</div>
                  <h3 className="text-xl font-bold">Activity Calendar</h3>
                </div>
                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <ChevronRight className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-5">
                View your daily activity in a heat map calendar with color-coded Bristol types.
              </p>
              <button
                onClick={() => navigate('/calendar')}
                className="btn-primary w-full text-base"
              >
                Open Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Dr. Poo Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen ? (
          <div className="animate-slide-up mb-4">
            <div className="card w-96 max-w-[calc(100vw-3rem)] shadow-2xl">
              {/* Chat Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="text-4xl animate-bounce-subtle">💩</div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                      Dr. Poo
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Online now</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Minimize chat"
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto space-y-4 mb-4 scrollbar-hide">
                {chatMessages.length === 0 && (
                  <div className="text-center mt-12 animate-fade-in">
                    <div className="text-5xl mb-3">💩</div>
                    <p className="font-bold text-base mb-2 text-gray-900 dark:text-white">
                      Hi! I'm Dr. Poo
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 px-4">
                      Ask me about your gut health, patterns, or what you ate today!
                    </p>
                  </div>
                )}

                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="animate-slide-up">
                    <div className="flex items-end space-x-2 mb-2">
                      {msg.role === 'assistant' && (
                        <div className="text-2xl mb-1 flex-shrink-0">💩</div>
                      )}
                      <div
                        className={`${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white ml-auto rounded-tl-2xl rounded-bl-2xl rounded-br-2xl'
                            : 'bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-gray-100 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl'
                        } px-4 py-3 text-sm shadow-md max-w-[80%]`}
                      >
                        {msg.content}
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400 mb-1 flex-shrink-0">
                          {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>

                    {msg.suggestedActions &&
                      msg.suggestedActions.map((action, actionIdx) => (
                        <button
                          key={actionIdx}
                          onClick={() => handleSuggestedAction(action)}
                          className="btn-secondary mt-2 text-xs py-2 w-full ml-10"
                        >
                          {action.buttonText}
                        </button>
                      ))}
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-end space-x-2 animate-fade-in">
                    <div className="text-2xl mb-1">💩</div>
                    <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl px-4 py-3 shadow-md">
                      <div className="flex space-x-2">
                        <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" />
                        <div
                          className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        />
                        <div
                          className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex space-x-2 pt-4 border-t-2 border-gray-100 dark:border-gray-700">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !chatLoading && sendChatMessage()}
                  placeholder="Ask Dr. Poo anything..."
                  className="input-field flex-1 text-sm"
                  disabled={chatLoading}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={chatLoading || !chatInput.trim()}
                  className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  aria-label="Send message"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Floating Chat Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="relative w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 rounded-full shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center group"
          aria-label={chatOpen ? 'Close chat' : 'Open chat with Dr. Poo'}
        >
          <div className="text-3xl group-hover:scale-110 transition-transform duration-200">💩</div>
          {!chatOpen && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
          )}
        </button>
      </div>

      {/* Stool Log Modal */}
      <StoolLogModal
        isOpen={stoolModalOpen}
        onClose={() => setStoolModalOpen(false)}
        onSuccess={() => {
          loadDashboardData();
          alert('Stool logged successfully!');
        }}
      />

      {/* Meal Log Modal */}
      <MealLogModal
        isOpen={mealModalOpen}
        onClose={() => setMealModalOpen(false)}
        onSuccess={() => {
          loadDashboardData();
          alert('Meal logged successfully!');
        }}
      />
    </div>
  );
};

export default DashboardNew;
