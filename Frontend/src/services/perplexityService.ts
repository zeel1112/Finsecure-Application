import axios from 'axios';

// Perplexity Pro API configuration
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
// Available models (as of 2024):
// - sonar-pro: Flagship model with 200k token context window (best for complex tasks)
// - sonar: Base model with 128k token context window (cost-effective)
// - sonar-reasoning-pro: Advanced reasoning model with 128k context
// - sonar-reasoning: Fast real-time reasoning model with 128k context
// - sonar-deep-research: Expert-level research model with 128k context
// - r1-1776: Specialized model without web search
const PERPLEXITY_MODEL = 'sonar-pro'; // Using flagship model for best financial advice

// Get API key from environment variables
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
  if (!apiKey) {
    console.error('Perplexity API key is missing. Please set VITE_PERPLEXITY_API_KEY in your .env file.');
    throw new Error('Perplexity API key is not configured. Please set VITE_PERPLEXITY_API_KEY in your .env file and restart the development server.');
  }
  return apiKey;
};

// Check if AI Assistant feature is enabled
// This prevents API calls if the feature is disabled
export const isAIAssistantFeatureEnabled = (): boolean => {
  const enabled = import.meta.env.VITE_ENABLE_AI_ASSISTANT;
  return enabled?.toLowerCase() === 'true';
};

export interface PerplexityMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface PerplexityResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  citations?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: string[];
}

/**
 * Send a message to Perplexity Pro API
 */
export const sendMessage = async (
  messages: PerplexityMessage[],
  context?: string
): Promise<PerplexityResponse> => {
  // Check if feature is enabled before making API calls
  if (!isAIAssistantFeatureEnabled()) {
    throw new Error('AI Assistant feature is disabled. Set VITE_ENABLE_AI_ASSISTANT=true to enable.');
  }

  try {
    const apiKey = getApiKey();
    
    // Add financial context if provided
    const systemMessage: PerplexityMessage = {
      role: 'system',
      content: context 
        ? `You are a helpful financial assistant. Use the following context about the user's finances to provide personalized advice: ${context}`
        : 'You are a helpful financial assistant. Provide clear, actionable financial advice and insights.'
    };

    const requestMessages = [systemMessage, ...messages];

    const requestPayload = {
      model: PERPLEXITY_MODEL,
      messages: requestMessages,
      temperature: 0.7,
      max_tokens: 1000,
    };

    // Debug logging (remove in production)
    if (import.meta.env.DEV) {
      console.log('Perplexity API Request:', {
        url: PERPLEXITY_API_URL,
        model: PERPLEXITY_MODEL,
        messageCount: requestMessages.length,
      });
    }

    const response = await axios.post<PerplexityResponse>(
      PERPLEXITY_API_URL,
      requestPayload,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data;
      
      if (status === 401) {
        throw new Error('Invalid Perplexity API key. Please check your configuration in the .env file.');
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (status === 400) {
        const errorMsg = errorData?.error?.message || errorData?.message || 'Invalid request';
        throw new Error(`Invalid request: ${errorMsg}. Please check the model name and request format.`);
      } else if (status === 404) {
        throw new Error('Perplexity API endpoint not found. Please check the API URL.');
      } else if (error.response) {
        const errorMsg = errorData?.error?.message || errorData?.message || error.message;
        throw new Error(`Perplexity API error (${status}): ${errorMsg}`);
      } else if (error.request) {
        throw new Error('No response from Perplexity API. Please check your internet connection.');
      }
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to connect to Perplexity API: ${errorMessage}`);
  }
};

/**
 * Get financial insights based on user's transaction data
 */
export const getFinancialInsights = async (
  transactions: any[],
  budgets: any[],
  goals: any[]
): Promise<string> => {
  const context = `
    User's Financial Summary:
    - Total Transactions: ${transactions.length}
    - Active Budgets: ${budgets.length}
    - Financial Goals: ${goals.length}
    - Recent spending patterns and categories
  `;

  const messages: PerplexityMessage[] = [
    {
      role: 'user',
      content: 'Analyze my financial data and provide personalized insights and recommendations for better financial management.'
    }
  ];

  const response = await sendMessage(messages, context);
  return response.choices[0]?.message?.content || 'Unable to generate insights at this time.';
};

/**
 * Ask a financial question
 */
export const askFinancialQuestion = async (question: string): Promise<ChatMessage> => {
  const messages: PerplexityMessage[] = [
    {
      role: 'user',
      content: question
    }
  ];

  const response = await sendMessage(messages);
  
  // Extract citations from response (may be in different locations)
  const citations = response.citations || 
                    (response as any).citations || 
                    (response.choices[0] as any)?.citations || 
                    undefined;
  
  return {
    id: response.id || `msg-${Date.now()}`,
    role: 'assistant',
    content: response.choices[0]?.message?.content || 'I apologize, but I could not generate a response.',
    timestamp: new Date(),
    citations: citations,
  };
};

/**
 * Get budget recommendations
 */
export const getBudgetRecommendations = async (
  income: number,
  expenses: number,
  categories: Record<string, number>
): Promise<string> => {
  const context = `
    Monthly Income: $${income}
    Monthly Expenses: $${expenses}
    Spending by Category: ${JSON.stringify(categories)}
  `;

  const messages: PerplexityMessage[] = [
    {
      role: 'user',
      content: 'Based on my income and spending patterns, provide specific budget recommendations and savings strategies.'
    }
  ];

  const response = await sendMessage(messages, context);
  return response.choices[0]?.message?.content || 'Unable to generate recommendations at this time.';
};
