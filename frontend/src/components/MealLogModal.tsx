import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';

interface MealLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MealLogModal = ({ isOpen, onClose, onSuccess }: MealLogModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    mealType: 'BREAKFAST',
    description: '',
    ingredients: '',
    loggedAt: new Date().toISOString().slice(0, 16),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert ingredients string to array
      const ingredientsArray = formData.ingredients
        .split(',')
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      await api.post('/meals', {
        mealType: formData.mealType,
        description: formData.description,
        ingredients: ingredientsArray,
        loggedAt: new Date(formData.loggedAt).toISOString(),
      });

      onSuccess();
      onClose();
      // Reset form
      setFormData({
        mealType: 'BREAKFAST',
        description: '',
        ingredients: '',
        loggedAt: new Date().toISOString().slice(0, 16),
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to log meal');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">Log Meal</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Meal Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Meal Type *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, mealType: type })}
                  className={`p-3 rounded-lg border-2 capitalize transition-colors ${
                    formData.mealType === type
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                  }`}
                >
                  {type.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description *</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              placeholder="e.g., Grilled chicken with rice and broccoli"
              required
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">Brief description of what you ate</p>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium mb-2">Ingredients (Optional)</label>
            <textarea
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              className="input-field min-h-[100px]"
              placeholder="e.g., chicken, rice, broccoli, olive oil"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate ingredients with commas. This helps track food triggers.
            </p>
          </div>

          {/* Date/Time */}
          <div>
            <label className="block text-sm font-medium mb-2">Date & Time</label>
            <input
              type="datetime-local"
              value={formData.loggedAt}
              onChange={(e) => setFormData({ ...formData, loggedAt: e.target.value })}
              className="input-field"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : 'Save Meal'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MealLogModal;
