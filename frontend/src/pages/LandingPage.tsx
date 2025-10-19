import { Link } from 'react-router-dom';
import { Activity, TrendingUp, Users, Sparkles } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">Poopal</h1>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-primary-600">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">
            Your Gut's Best Friend{' '}
            <span className="inline-block">💩</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Track your digestive health with AI-powered insights. Upload stool photos, log meals,
            and discover patterns that help you feel your best.
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-block">
            Start Tracking Free
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="card text-center">
            <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="text-primary-600" size={32} />
            </div>
            <h3 className="font-semibold text-lg mb-2">AI Photo Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Upload photos for instant Bristol Scale classification
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-secondary-100 dark:bg-secondary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-secondary-600" size={32} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Pattern Detection</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Identify food triggers and digestive patterns
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-purple-600" size={32} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Social Support</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Join accountability groups for motivation
            </p>
          </div>

          <div className="card text-center">
            <div className="bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-orange-600" size={32} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Personalized Insights</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get AI-powered recommendations for better gut health
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
