import { Intent, MCPResponse } from '../types';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
// In a real application, you would store your API key securely
const anthropic = new Anthropic({
  apiKey: 'YOUR_ANTHROPIC_API_KEY', // Replace with actual API key
});

// Define a system prompt that guides Claude to act as our MCP
const MCP_SYSTEM_PROMPT = `
You are the Message Control Protocol (MCP) client for a chatbot system.
Your role is to:
1. Analyze user messages to determine intent
2. Extract relevant entities from the message
3. Suggest appropriate actions
4. Return structured responses that can be used by the chatbot system

Respond in a JSON format with the following structure:
{
  "content": "Your response to the user",
  "intent": "The detected intent (greeting, farewell, question, help, unknown)",
  "entities": {
    "entity1": "value1",
    "entity2": "value2"
  },
  "confidence": 0.95,
  "suggestedActions": ["action1", "action2"]
}
`;

export const mcpClientService = {
  // Process message through Claude
  processMessage: async (message: string, conversationHistory: Array<{role: 'user' | 'assistant', content: string}>): Promise<MCPResponse> => {
    try {
      // In a development environment, we can use a mock implementation
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK_MCP === 'true') {
        return mockProcessMessage(message);
      }
      
      // Send message to Claude
      const response = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1024,
        messages: [
          ...conversationHistory,
          { role: 'user' as const, content: message }
        ],
        system: MCP_SYSTEM_PROMPT,
      });
      
      // Parse the response from Claude
      try {
        const jsonResponse = JSON.parse(response.content[0].text);
        return {
          content: jsonResponse.content,
          intent: jsonResponse.intent as Intent,
          entities: jsonResponse.entities,
          confidence: jsonResponse.confidence,
          suggestedActions: jsonResponse.suggestedActions
        };
      } catch (parseError) {
        // Fallback in case Claude doesn't return valid JSON
        return {
          content: response.content[0].text,
          intent: Intent.UNKNOWN,
          confidence: 0.5
        };
      }
    } catch (error) {
      console.error('Error calling Claude MCP:', error);
      // Fallback response in case of API failure
      return {
        content: "I'm sorry, I'm having trouble processing your request right now.",
        intent: Intent.UNKNOWN,
        confidence: 0
      };
    }
  }
};

// Mock implementation for testing without API calls
function mockProcessMessage(message: string): MCPResponse {
  const lowerMessage = message.toLowerCase();
  
  // Simple intent detection based on keywords
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return {
      content: "Hello! How can I help you today?",
      intent: Intent.GREETING,
      confidence: 0.95
    };
  } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
    return {
      content: "Goodbye! Have a great day!",
      intent: Intent.FAREWELL,
      confidence: 0.95
    };
  } else if (lowerMessage.includes('help')) {
    return {
      content: "I can help you with various tasks. Just let me know what you need!",
      intent: Intent.HELP,
      confidence: 0.9,
      suggestedActions: ["show_faq", "contact_support"]
    };
  } else if (lowerMessage.includes('?')) {
    return {
      content: "That's an interesting question. Let me think about that.",
      intent: Intent.QUESTION,
      confidence: 0.8
    };
  } else {
    return {
      content: "I'm not sure I understand. Could you rephrase that?",
      intent: Intent.UNKNOWN,
      confidence: 0.6
    };
  }
}
