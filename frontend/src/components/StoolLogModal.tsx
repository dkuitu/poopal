import { useState, useRef } from 'react';
import { X, Camera, Upload, Sparkles, Loader2 } from 'lucide-react';
import api from '../services/api';

interface StoolLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AIAnalysisResult {
  bristolType: number | null;
  color: string | null;
  colorPalette: string[];
  consistency: string | null;
  bloodPresent: boolean;
  mucusPresent: boolean;
  undigestedFood: boolean;
  confidenceScore: number;
  rawAnalysis: string;
  detectedFeatures: string[];
}

const BROWN_PALETTE = ['#8B4513', '#A0522D', '#654321'];

const StoolLogModal = ({ isOpen, onClose, onSuccess }: StoolLogModalProps) => {
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [colorPalette, setColorPalette] = useState<string[]>(BROWN_PALETTE);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    bristolType: 4,
    color: BROWN_PALETTE[0],
    consistency: 'SOFT',
    size: 'MEDIUM',
    urgency: 5,
    completeness: 10,
    bloodPresent: false,
    mucusPresent: false,
    undigestedFood: false,
    photoUrl: '',
    notes: '',
    loggedAt: new Date().toISOString(),
  });

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    setError('');
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPhotoPreview(base64);

      // Start AI analysis
      await analyzePhoto(base64);
    };

    reader.readAsDataURL(file);
  };

  const analyzePhoto = async (base64Image: string) => {
    setAiAnalyzing(true);
    setError('');

    try {
      // Extract base64 data without the data:image prefix
      const base64Data = base64Image.split(',')[1];

      const { data } = await api.post<{ status: string; data: AIAnalysisResult }>(
        '/ai/analyze-stool-image',
        {
          imageBase64: base64Data,
        }
      );

      const analysis = data.data;

      // Update form with AI analysis
      setFormData({
        ...formData,
        bristolType: analysis.bristolType || 4,
        color: analysis.color || BROWN_PALETTE[0],
        consistency: analysis.consistency || 'SOFT',
        bloodPresent: analysis.bloodPresent,
        mucusPresent: analysis.mucusPresent,
        undigestedFood: analysis.undigestedFood,
        photoUrl: base64Image,
        notes:
          formData.notes ||
          `AI Analysis (${analysis.confidenceScore}% confidence):\n${analysis.detectedFeatures.join(', ')}`,
      });

      if (analysis.colorPalette && analysis.colorPalette.length === 3) {
        setColorPalette(analysis.colorPalette);
      }
    } catch (err: any) {
      console.error('AI analysis error:', err);
      setError(err.response?.data?.message || 'AI analysis failed. You can still log manually.');
      // Keep the photo preview even if AI fails
      setFormData({ ...formData, photoUrl: base64Image });
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Don't send photoUrl (base64 images are too large for DB)
      // Don't send color (DB expects enum, not HEX) - store in notes instead
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { photoUrl, color, ...dataToSend } = formData;

      // Add color to notes
      const notesWithColor = formData.notes
        ? `${formData.notes}\n\nColor: ${color}`
        : `Color: ${color}`;

      await api.post('/stools', { ...dataToSend, notes: notesWithColor });
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        bristolType: 4,
        color: BROWN_PALETTE[0],
        consistency: 'SOFT',
        size: 'MEDIUM',
        urgency: 5,
        completeness: 10,
        bloodPresent: false,
        mucusPresent: false,
        undigestedFood: false,
        photoUrl: '',
        notes: '',
        loggedAt: new Date().toISOString(),
      });
      setPhotoPreview(null);
      setColorPalette(BROWN_PALETTE);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to log stool');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">📝</div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Log Stool
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 transform hover:scale-110"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-5 py-4 rounded-xl flex items-start space-x-3 animate-slide-up">
              <div className="text-xl">⚠️</div>
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Photo Upload with AI Analysis */}
          <div className="bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 dark:from-primary-900/30 dark:via-purple-900/30 dark:to-pink-900/30 p-5 rounded-2xl border-2 border-primary-200 dark:border-primary-700 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Sparkles className="text-primary-600 dark:text-primary-400" size={22} />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI-Powered Analysis</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Instant insights from your photo</p>
              </div>
            </div>

            {!photoPreview ? (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Upload a photo for instant AI analysis of Bristol type, color, and more!
                </p>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2"
                  >
                    <Upload size={18} />
                    <span>Upload Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Camera size={18} />
                    <span>Take Photo</span>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>
            ) : (
              <div>
                <div className="relative mb-3">
                  <img
                    src={photoPreview}
                    alt="Stool preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview(null);
                      setFormData({ ...formData, photoUrl: '' });
                      setColorPalette(BROWN_PALETTE);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
                {aiAnalyzing && (
                  <div className="flex items-center justify-center space-x-2 text-primary-600">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-sm font-medium">Analyzing with AI...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bristol Type */}
          <div>
            <label className="block text-sm font-bold mb-3 flex items-center space-x-2">
              <span>Bristol Type</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-7 gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, bristolType: type })}
                  className={`p-4 rounded-xl border-2 font-bold text-xl transition-all duration-200 transform ${
                    formData.bristolType === type
                      ? 'border-primary-600 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900 dark:to-primary-800 scale-110 shadow-lg'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:scale-105 hover:shadow-md'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                <span className="text-red-600">1-2:</span> Constipation |
                <span className="text-green-600"> 3-4:</span> Ideal |
                <span className="text-orange-600"> 5-7:</span> Diarrhea
              </p>
            </div>
          </div>

          {/* Color Palette Picker */}
          <div>
            <label className="block text-sm font-bold mb-3">Color</label>
            <div className="grid grid-cols-3 gap-4 mb-3">
              {colorPalette.map((hexColor) => (
                <button
                  key={hexColor}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: hexColor })}
                  className={`h-20 rounded-2xl border-4 transition-all duration-200 transform shadow-md ${
                    formData.color === hexColor
                      ? 'border-primary-600 scale-110 shadow-xl ring-4 ring-primary-200 dark:ring-primary-800'
                      : 'border-gray-300 dark:border-gray-600 hover:scale-105 hover:shadow-lg hover:border-primary-400'
                  }`}
                  style={{ backgroundColor: hexColor }}
                  title={hexColor}
                  aria-label={`Select color ${hexColor}`}
                />
              ))}
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Selected: <span className="font-mono font-bold text-primary-600 dark:text-primary-400">{formData.color}</span>
              </p>
            </div>
          </div>

          {/* Consistency */}
          <div>
            <label className="block text-sm font-medium mb-2">Consistency</label>
            <div className="grid grid-cols-5 gap-2">
              {['HARD', 'FIRM', 'SOFT', 'LIQUID', 'WATERY'].map((consistency) => (
                <button
                  key={consistency}
                  type="button"
                  onClick={() => setFormData({ ...formData, consistency })}
                  className={`p-2 rounded-lg border-2 text-sm capitalize transition-colors ${
                    formData.consistency === consistency
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                  }`}
                >
                  {consistency.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium mb-2">Size</label>
            <div className="grid grid-cols-3 gap-2">
              {['SMALL', 'MEDIUM', 'LARGE'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFormData({ ...formData, size })}
                  className={`p-3 rounded-lg border-2 capitalize transition-colors ${
                    formData.size === size
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                  }`}
                >
                  {size.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Urgency & Completeness */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Urgency (1-10): {formData.urgency}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Completeness (1-10): {formData.completeness}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.completeness}
                onChange={(e) =>
                  setFormData({ ...formData, completeness: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.bloodPresent}
                onChange={(e) => setFormData({ ...formData, bloodPresent: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Blood present</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.mucusPresent}
                onChange={(e) => setFormData({ ...formData, mucusPresent: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Mucus present</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.undigestedFood}
                onChange={(e) => setFormData({ ...formData, undigestedFood: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Undigested food</span>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field min-h-[80px]"
              placeholder="Any additional details..."
              maxLength={500}
            />
          </div>

          {/* Date/Time */}
          <div>
            <label className="block text-sm font-medium mb-2">Date & Time</label>
            <input
              type="datetime-local"
              value={formData.loggedAt.slice(0, 16)}
              onChange={(e) =>
                setFormData({ ...formData, loggedAt: new Date(e.target.value).toISOString() })
              }
              className="input-field"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4 border-t-2 border-gray-100 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading || aiAnalyzing}
              className="btn-primary flex-1 text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Saving...</span>
                </span>
              ) : (
                'Save Log'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-8 py-4"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoolLogModal;
