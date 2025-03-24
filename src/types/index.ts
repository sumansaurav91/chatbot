// Message Types
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// User Types
export interface User {
  id: string;
  name: string;
}

// Conversation Types
export interface Conversation {
  id: string;
  userId: string;
  messages: Message[];
  startedAt: Date;
  lastUpdatedAt: Date;
}

// Intent Types
export enum Intent {
  GREETING = 'greeting',
  FAREWELL = 'farewell',
  QUESTION = 'question',
  HELP = 'help',
  UNKNOWN = 'unknown'
}

// Claude MCP Response Types
export interface MCPResponse {
  content: string;
  intent: Intent;
  entities?: Record<string, any>;
  confidence: number;
  suggestedActions?: string[];
}

// External API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
