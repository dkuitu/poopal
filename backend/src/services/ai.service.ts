import axios from 'axios';
import { OPENAI_API_KEY, OPENAI_API_URL } from '../config/constants';
import { AppError } from '../middleware/error-handler.middleware';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{ type: 'text' | 'image_url'; text?: string; image_url?: { url: string } }>;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface StoolAnalysisResult {
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

export const analyzeStoolImage = async (
  imageBase64: string,
  customPrompt?: string
): Promise<StoolAnalysisResult> => {
  if (!OPENAI_API_KEY) {
    throw new AppError(500, 'OpenAI API key not configured');
  }

  const defaultPrompt = `You are a medical assistant analyzing a stool sample image. Please analyze the image and provide the following information in JSON format:

{
  "bristolType": <number 1-7 based on Bristol Stool Chart, or null if cannot determine>,
  "color": <single HEX color code representing the primary/dominant color of the stool, e.g., "#8B4513", or null>,
  "colorPalette": <array of exactly 3 hex color codes representing the dominant colors in the stool, e.g., ["#8B4513", "#A0522D", "#654321"]>,
  "consistency": <one of: HARD, FIRM, SOFT, LIQUID, WATERY, or null>,
  "bloodPresent": <boolean>,
  "mucusPresent": <boolean>,
  "undigestedFood": <boolean>,
  "confidenceScore": <number 0-100 representing your confidence in this analysis>,
  "notes": <string with any additional observations>,
  "detectedFeatures": <array of strings describing what you observed>
}

Bristol Stool Chart reference:
Type 1: Separate hard lumps (severe constipation)
Type 2: Sausage-shaped but lumpy
Type 3: Like a sausage with cracks on surface
Type 4: Like a sausage, smooth and soft (ideal)
Type 5: Soft blobs with clear-cut edges
Type 6: Fluffy pieces with ragged edges (mild diarrhea)
Type 7: Watery, no solid pieces (severe diarrhea)

Only return the JSON object, no additional text.`;

  const prompt = customPrompt || defaultPrompt;

  try {
    const messages: OpenAIMessage[] = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
        ],
      },
    ];

    const response = await axios.post<OpenAIResponse>(
      `${OPENAI_API_URL}/chat/completions`,
      {
        model: 'gpt-4-turbo',
        messages,
        temperature: 0.3, // Lower temperature for more consistent medical analysis
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        timeout: 30000, // 30 second timeout
      }
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new AppError(500, 'No response from AI model');
    }

    // Try to parse JSON from the response
    let parsed: any;
    try {
      // Remove markdown code blocks if present
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleanedContent);
    } catch (parseError) {
      // If parsing fails, return raw response
      return {
        bristolType: null,
        color: null,
        colorPalette: [],
        consistency: null,
        bloodPresent: false,
        mucusPresent: false,
        undigestedFood: false,
        confidenceScore: 0,
        rawAnalysis: content,
        detectedFeatures: ['Failed to parse AI response as JSON'],
      };
    }

    return {
      bristolType: parsed.bristolType || null,
      color: parsed.color || null,
      colorPalette: parsed.colorPalette || [],
      consistency: parsed.consistency || null,
      bloodPresent: parsed.bloodPresent || false,
      mucusPresent: parsed.mucusPresent || false,
      undigestedFood: parsed.undigestedFood || false,
      confidenceScore: parsed.confidenceScore || 0,
      rawAnalysis: content,
      detectedFeatures: parsed.detectedFeatures || [],
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error?.message || error.message;
      throw new AppError(500, `OpenAI API error: ${message}`);
    }
    throw error;
  }
};
