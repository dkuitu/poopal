import axios from 'axios';
import pool from '../config/pg-client';
import { DEEPSEEK_API_KEY, DEEPSEEK_API_URL } from '../config/constants';
import { AppError } from '../middleware/error-handler.middleware';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  message: string;
  suggestedActions?: Array<{
    type: 'add_meal' | 'log_stool' | 'view_trigger' | 'none';
    data?: any;
    buttonText?: string;
  }>;
}

interface MealSuggestion {
  mealType: string;
  description: string;
  ingredients: string[];
  estimatedFiberG?: number;
  loggedAt: string;
}

export const buildUserContext = async (userId: string): Promise<string> => {
  try {
    // Get recent stool logs
    const stoolLogs = await pool.query(
      `SELECT bristol_type, color, consistency, logged_at, notes
       FROM stool_logs
       WHERE user_id = $1
       ORDER BY logged_at DESC
       LIMIT 30`,
      [userId]
    );

    // Get recent meal logs
    const mealLogs = await pool.query(
      `SELECT meal_type, description, logged_at
       FROM meal_logs
       WHERE user_id = $1
       ORDER BY logged_at DESC
       LIMIT 20`,
      [userId]
    );

    // Get triggers
    const triggers = await pool.query(
      `SELECT t.trigger_type, t.confidence_score, t.occurrences, f.name as food_name
       FROM triggers t
       JOIN foods f ON t.food_id = f.id
       WHERE t.user_id = $1 AND t.confidence_score > 60
       ORDER BY t.confidence_score DESC
       LIMIT 10`,
      [userId]
    );

    // Get recent symptoms
    const symptoms = await pool.query(
      `SELECT symptom_type, severity, logged_at
       FROM symptom_logs
       WHERE user_id = $1
       ORDER BY logged_at DESC
       LIMIT 10`,
      [userId]
    );

    // Build context string
    let context = 'User Health Data:\n\n';

    // Stool logs summary
    if (stoolLogs.rows.length > 0) {
      context += `Recent Stool Logs (${stoolLogs.rows.length} entries):\n`;
      const bristolAvg =
        stoolLogs.rows.reduce((sum, log) => sum + log.bristol_type, 0) / stoolLogs.rows.length;
      context += `- Average Bristol Type: ${bristolAvg.toFixed(1)}\n`;
      context += `- Most recent: Type ${stoolLogs.rows[0].bristol_type}, ${stoolLogs.rows[0].color}, ${stoolLogs.rows[0].logged_at.toISOString().split('T')[0]}\n`;

      const lastLogDate = new Date(stoolLogs.rows[0].logged_at);
      const daysSinceLog = Math.floor(
        (Date.now() - lastLogDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      context += `- Days since last log: ${daysSinceLog}\n`;
    } else {
      context += 'No stool logs yet.\n';
    }

    // Meal logs summary
    if (mealLogs.rows.length > 0) {
      context += `\nRecent Meal Logs (${mealLogs.rows.length} entries):\n`;
      context += `- Last meal: ${mealLogs.rows[0].meal_type} - ${mealLogs.rows[0].description}\n`;
      const lastMealDate = new Date(mealLogs.rows[0].logged_at);
      const daysSinceMeal = Math.floor(
        (Date.now() - lastMealDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      context += `- Days since last meal log: ${daysSinceMeal}\n`;
    } else {
      context += '\nNo meal logs yet.\n';
    }

    // Triggers summary
    if (triggers.rows.length > 0) {
      context += `\nIdentified Triggers (${triggers.rows.length}):\n`;
      triggers.rows.forEach((t) => {
        context += `- ${t.food_name}: ${t.trigger_type} (${t.confidence_score}% confidence, ${t.occurrences} occurrences)\n`;
      });
    }

    // Symptoms summary
    if (symptoms.rows.length > 0) {
      context += `\nRecent Symptoms (${symptoms.rows.length} entries):\n`;
      const symptomCounts: { [key: string]: number } = {};
      symptoms.rows.forEach((s) => {
        symptomCounts[s.symptom_type] = (symptomCounts[s.symptom_type] || 0) + 1;
      });
      Object.entries(symptomCounts).forEach(([type, count]) => {
        context += `- ${type}: ${count} times\n`;
      });
    }

    return context;
  } catch (error) {
    console.error('Error building user context:', error);
    return 'Unable to load user data.';
  }
};

export const chat = async (userId: string, userMessage: string): Promise<ChatResponse> => {
  if (!DEEPSEEK_API_KEY) {
    throw new AppError(500, 'DeepSeek API key not configured');
  }

  try {
    // Build context from user's health data
    const userContext = await buildUserContext(userId);

    // Get recent stool logs to check for gaps
    const stoolCheck = await pool.query(
      `SELECT logged_at FROM stool_logs
       WHERE user_id = $1
       ORDER BY logged_at DESC
       LIMIT 1`,
      [userId]
    );

    const daysSinceLastLog = stoolCheck.rows.length
      ? Math.floor(
          (Date.now() - new Date(stoolCheck.rows[0].logged_at).getTime()) / (1000 * 60 * 60 * 24)
        )
      : 999;

    // Check for missing meal data
    const mealCheck = await pool.query(
      `SELECT COUNT(*) as meal_count
       FROM meal_logs
       WHERE user_id = $1 AND logged_at >= NOW() - INTERVAL '2 days'`,
      [userId]
    );

    const recentMealCount = parseInt(mealCheck.rows[0].meal_count);

    // System prompt for Dr. Poo
    const systemPrompt = `You are Dr. Poo, a friendly and knowledgeable digestive health AI assistant.
Your personality: Casual, supportive, encouraging, uses occasional emojis (not too many), speaks like a helpful friend rather than a clinical doctor.

Your capabilities:
- Analyze patterns in stool logs (Bristol Stool Chart Types 1-7)
- Identify food triggers and correlations
- Provide actionable advice for gut health
- Encourage consistent logging
- Be proactive about asking for missing data

Context about this user:
${userContext}

Important behaviors:
${daysSinceLastLog >= 3 ? '- The user hasnt logged in ' + daysSinceLastLog + ' days. Gently ask if they forgot to log or are experiencing constipation.' : ''}
${recentMealCount < 3 ? '- The user has minimal meal data. Proactively ask what theyve eaten recently to help identify patterns.' : ''}

When the user tells you about a meal:
1. Parse the meal details (meal type, ingredients, timing)
2. Respond with "Ive created a meal log for you" and include a structured meal suggestion
3. Mark your response with [MEAL_SUGGESTION] followed by JSON

Format for meal suggestions:
[MEAL_SUGGESTION]
{
  "mealType": "BREAKFAST|LUNCH|DINNER|SNACK",
  "description": "parsed meal description",
  "ingredients": ["ingredient1", "ingredient2"],
  "estimatedFiberG": number or null,
  "loggedAt": "ISO datetime string"
}

When detecting multiple missed stool logs:
1. Ask how many times they went
2. Offer to help log them with templates

Keep responses concise (2-4 sentences max). Break into short paragraphs. Be encouraging about progress and supportive about setbacks.`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userMessage,
      },
    ];

    // Call DeepSeek API
    const response = await axios.post(
      `${DEEPSEEK_API_URL}/chat/completions`,
      {
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    const aiMessage = response.data.choices[0]?.message?.content || 'Sorry, I had trouble responding.';

    // Parse for meal suggestions
    const suggestedActions: ChatResponse['suggestedActions'] = [];
    const mealMatch = aiMessage.match(/\[MEAL_SUGGESTION\]\s*(\{[\s\S]*?\})/);

    if (mealMatch) {
      try {
        const mealData = JSON.parse(mealMatch[1]);
        suggestedActions.push({
          type: 'add_meal',
          data: mealData,
          buttonText: '✅ Add to Meal Logs',
        });
      } catch (parseError) {
        console.error('Failed to parse meal suggestion:', parseError);
      }
    }

    // Clean up the message (remove JSON from display)
    const cleanMessage = aiMessage.replace(/\[MEAL_SUGGESTION\][\s\S]*?\}/, '').trim();

    return {
      message: cleanMessage,
      suggestedActions: suggestedActions.length > 0 ? suggestedActions : undefined,
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error?.message || error.message;
      throw new AppError(500, `DeepSeek API error: ${message}`);
    }
    throw error;
  }
};

export const getProactiveInsight = async (userId: string): Promise<ChatResponse | null> => {
  try {
    // Check if this is a brand new user
    const userCheck = await pool.query(
      `SELECT created_at FROM users WHERE id = $1`,
      [userId]
    );

    if (!userCheck.rows.length) {
      return null;
    }

    const userCreatedAt = new Date(userCheck.rows[0].created_at);
    const accountAgeMinutes = (Date.now() - userCreatedAt.getTime()) / (1000 * 60);

    // Check if user has any logs at all
    const stoolCheck = await pool.query(
      `SELECT logged_at FROM stool_logs
       WHERE user_id = $1
       ORDER BY logged_at DESC
       LIMIT 1`,
      [userId]
    );

    const mealCheckForNewUser = await pool.query(
      `SELECT COUNT(*) as count FROM meal_logs WHERE user_id = $1`,
      [userId]
    );

    const hasAnyLogs = stoolCheck.rows.length > 0 || parseInt(mealCheckForNewUser.rows[0].count) > 0;
    const daysSinceLastLog = stoolCheck.rows.length
      ? Math.floor(
          (Date.now() - new Date(stoolCheck.rows[0].logged_at).getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

    // If new user (< 10 minutes old) and no logs, show welcome message
    if (accountAgeMinutes < 10 && !hasAnyLogs) {
      return {
        message: `Hey there! 👋 I'm Dr. Poo, your friendly digestive health AI assistant!\n\n**Disclaimer:** I'm not a real doctor—just an AI here to help you track patterns and learn about your gut health. Always consult a real healthcare professional for medical advice.\n\nI can help you:\n• Log and analyze your bathroom visits\n• Track meals and find food triggers\n• Spot patterns in your digestive health\n• Answer questions about gut health\n\nJust tell me what you ate or ask me anything! For example: "I had a burger for lunch" or "How's my gut health?"`,
        suggestedActions: undefined,
      };
    }

    // If 3+ days since last log and not a brand new user, send reminder
    if (daysSinceLastLog >= 3 && hasAnyLogs) {
      return {
        message: `Hey! I noticed you haven't logged anything in ${daysSinceLastLog} days. Did you forget to log, or are you experiencing constipation? 🤔`,
        suggestedActions: [
          {
            type: 'log_stool',
            buttonText: '💩 Log Missed Poops',
          },
        ],
      };
    }

    // Check for missing meal data
    const mealCheck = await pool.query(
      `SELECT COUNT(*) as meal_count
       FROM meal_logs
       WHERE user_id = $1 AND logged_at >= NOW() - INTERVAL '2 days'`,
      [userId]
    );

    const recentMealCount = parseInt(mealCheck.rows[0].meal_count);
    const stoolCount = await pool.query(
      `SELECT COUNT(*) as stool_count
       FROM stool_logs
       WHERE user_id = $1 AND logged_at >= NOW() - INTERVAL '2 days'`,
      [userId]
    );

    const recentStoolCount = parseInt(stoolCount.rows[0].stool_count);

    // If user is logging stools but not meals
    if (recentStoolCount > 0 && recentMealCount < 3) {
      const currentHour = new Date().getHours();
      let mealTime = 'today';
      if (currentHour < 11) mealTime = 'breakfast';
      else if (currentHour < 15) mealTime = 'lunch';
      else mealTime = 'dinner';

      return {
        message: `I see you've been tracking your poops, but not your meals! What did you eat for ${mealTime}? This helps me find patterns between food and your gut health. 🍽️`,
        suggestedActions: [
          {
            type: 'none',
            buttonText: '💬 Tell Dr. Poo',
          },
        ],
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting proactive insight:', error);
    return null;
  }
};
