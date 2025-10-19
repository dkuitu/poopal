import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Upload, Loader } from 'lucide-react';

const AITestPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setSelectedFile(file);
    setError('');
    setResult(null);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !previewUrl) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Convert image to base64
      const base64 = previewUrl.split(',')[1];

      const { data } = await api.post('/ai/analyze-stool-image', {
        imageBase64: base64,
        customPrompt: customPrompt || undefined,
      });

      setResult(data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-primary-600">AI Image Analysis Test</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="card space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Test DeepSeek Vision Capabilities</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Upload an image to test what the AI can detect. This is for testing purposes only.
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Upload Image</label>
            <div className="flex items-center space-x-4">
              <label className="btn-primary cursor-pointer flex items-center space-x-2">
                <Upload size={20} />
                <span>Choose File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              {selectedFile && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div>
              <label className="block text-sm font-medium mb-2">Preview</label>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-md max-h-64 object-contain rounded-lg border border-gray-300 dark:border-gray-600"
              />
            </div>
          )}

          {/* Custom Prompt */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Custom Prompt (Optional)
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="input-field min-h-[100px]"
              placeholder="Leave empty to use default medical analysis prompt..."
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Analyze Image</span>
            )}
          </button>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Analysis Results</h3>

              {/* Structured Results */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Bristol Type
                  </div>
                  <div className="text-2xl font-bold">
                    {result.bristolType || 'Not detected'}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Color Palette
                  </div>
                  {result.colorPalette && result.colorPalette.length > 0 ? (
                    <div className="flex space-x-2 mt-2">
                      {result.colorPalette.map((color: string, idx: number) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div
                            className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs mt-1 font-mono">{color}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-2xl font-bold">
                      {result.color || 'Not detected'}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Consistency
                  </div>
                  <div className="text-2xl font-bold">
                    {result.consistency || 'Not detected'}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Confidence Score
                  </div>
                  <div className="text-2xl font-bold">{result.confidenceScore}%</div>
                </div>
              </div>

              {/* Boolean Flags */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="text-sm font-medium mb-2">Detected Features</div>
                <div className="flex flex-wrap gap-2">
                  {result.bloodPresent && (
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-full text-sm">
                      Blood Present
                    </span>
                  )}
                  {result.mucusPresent && (
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-full text-sm">
                      Mucus Present
                    </span>
                  )}
                  {result.undigestedFood && (
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 rounded-full text-sm">
                      Undigested Food
                    </span>
                  )}
                  {!result.bloodPresent && !result.mucusPresent && !result.undigestedFood && (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      No concerning features detected
                    </span>
                  )}
                </div>
              </div>

              {/* AI Observations */}
              {result.detectedFeatures && result.detectedFeatures.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm font-medium mb-2">AI Observations</div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {result.detectedFeatures.map((feature: string, idx: number) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Raw Response */}
              <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <summary className="cursor-pointer text-sm font-medium">
                  Raw AI Response
                </summary>
                <pre className="mt-2 text-xs overflow-x-auto whitespace-pre-wrap">
                  {result.rawAnalysis}
                </pre>
              </details>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AITestPage;
