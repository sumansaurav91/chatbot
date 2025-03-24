import { Intent, Message } from '../types';
import { mockDBService } from './mockDBService';
import { mcpClientService } from './mcpClientService';
import { externalApiService } from './externalApiService';

export const chatbotService = {
  // Process a user message and generate a response
  processUserMessage: async (conversationId: string, userMessage: string): Promise<Message> => {
    try {
      // 1. Save user message to the database
      const userMessageObj = await mockDBService.addMessage(
        conversationId,
        userMessage,
        'user'
      );
      
      // 2. Get conversation history for context
      const messages = await mockDBService.getMessages(conversationId);
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
      
      // 3. Process the message through MCP client (Claude)
      const mcpResponse = await mcpClientService.processMessage(
        userMessage,
        conversationHistory
      );
      
      // 4. Based on intent, perform additional actions if needed
      let responseContent = mcpResponse.content;
      
      if (mcpResponse.intent === Intent.QUESTION && mcpResponse.entities) {
        // Check if we need to fetch external data
        if (mcpResponse.entities.needsExternalData && mcpResponse.entities.dataType) {
          const externalResponse = await externalApiService.getData(
            mcpResponse.entities.dataType,
            mcpResponse.entities.params
          );
          
          if (externalResponse.success && externalResponse.data) {
            // Enhance the response with external data
            responseContent = enhanceResponseWithData(
              responseContent,
              externalResponse.data
            );
          }
        }
      }
      
      // 5. Save bot response to the database
      const botMessageObj = await mockDBService.addMessage(
        conversationId,
        responseContent,
        'bot'
      );
      
      return botMessageObj;
    } catch (error) {
      console.error('Error processing user message:', error);
      
      // Save a fallback response if something goes wrong
      return mockDBService.addMessage(
        conversationId,
        "I'm sorry, I encountered an error processing your request. Please try again.",
        'bot'
      );
    }
  },
  
  // Create a new conversation for a user
  createConversation: async (userId: string): Promise<string> => {
    const conversation = await mockDBService.createConversation(userId);
    return conversation.id;
  },
  
  // Get all messages for a conversation
  getConversationMessages: async (conversationId: string): Promise<Message[]> => {
    return mockDBService.getMessages(conversationId);
  }
};

// Helper function to enhance responses with external data
function enhanceResponseWithData(response: string, data: any): string {
  if (typeof data === 'object') {
    // For weather data
    if (data.temperature && data.condition) {
      return `${response} It's currently ${data.temperature}°F and ${data.condition} in ${data.location}.`;
    }
    
    // For product data
    if (Array.isArray(data) && data[0]?.name && data[0]?.price) {
      const productList = data.map((product: any) => 
        `${product.name} ($${product.price.toFixed(2)})`
      ).join(', ');
      
      return `${response} Here are some products you might be interested in: ${productList}.`;
    }
  }
  
  return response;
}
