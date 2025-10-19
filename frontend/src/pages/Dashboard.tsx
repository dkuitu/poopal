import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Moon, Sun, Activity, Calendar, TrendingUp, Award, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-600">Poopal</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user?.username || user?.email}
              </span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6">Welcome back! 👋</h2>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Gut Health Score
              </h3>
              <Activity className="text-primary-600" size={20} />
            </div>
            <p className="text-3xl font-bold">85</p>
            <p className="text-xs text-green-600">+5 from last week</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Tracking Streak
              </h3>
              <Calendar className="text-orange-600" size={20} />
            </div>
            <p className="text-3xl font-bold">7 days</p>
            <p className="text-xs text-gray-500">Keep it up!</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Triggers Found
              </h3>
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <p className="text-3xl font-bold">3</p>
            <p className="text-xs text-gray-500">Dairy, Gluten, Coffee</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Achievements
              </h3>
              <Award className="text-yellow-600" size={20} />
            </div>
            <p className="text-3xl font-bold">12</p>
            <p className="text-xs text-gray-500">Unlocked</p>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="card text-center py-12">
          <h3 className="text-2xl font-bold mb-4">🚧 Dashboard Under Construction 🚧</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The full dashboard with stool logging, meal tracking, and AI insights is coming soon!
          </p>
          <div className="flex justify-center space-x-4">
            <button className="btn-primary">Log Stool</button>
            <button className="btn-secondary">Log Meal</button>
            <button
              onClick={() => navigate('/test-ai')}
              className="btn-secondary flex items-center space-x-2"
            >
              <Sparkles size={20} />
              <span>Test AI Analysis</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
