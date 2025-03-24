import { Conversation, Message, User } from '../types';
import conversationsData from '../mockDB/conversations.json';
import usersData from '../mockDB/users.json';

// Type assertions for our imported JSON data
interface RawConversation {
  id: string;
  userId: string;
  messages: {
    id: string;
    content: string;
    sender: 'user' | 'bot';
    timestamp: string;
  }[];
  startedAt: string;
  lastUpdatedAt: string;
}

interface RawConversationsData {
  conversations: RawConversation[];
}

const typedConversationsData = conversationsData as RawConversationsData;
const typedUsersData = usersData as { users: User[] };

// In-memory database to simulate persistence
let conversations: Conversation[] = typedConversationsData.conversations.map(conv => {
  // Convert raw JSON data to our TypeScript types with proper Date objects
  return {
    id: conv.id,
    userId: conv.userId,
    startedAt: new Date(conv.startedAt),
    lastUpdatedAt: new Date(conv.lastUpdatedAt),
    messages: conv.messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender,
      timestamp: new Date(msg.timestamp)
    }))
  };
});

let users: User[] = typedUsersData.users;

// Mock database service
export const mockDBService = {
  // User operations
  getUser: (userId: string): Promise<User | undefined> => {
    return Promise.resolve(users.find(user => user.id === userId));
  },
  
  createUser: (name: string): Promise<User> => {
    const newUser: User = {
      id: `user-${users.length + 1}`.padStart(7, '0'),
      name
    };
    users.push(newUser);
    return Promise.resolve(newUser);
  },
  
  // Conversation operations
  getConversation: (conversationId: string): Promise<Conversation | undefined> => {
    return Promise.resolve(conversations.find(conv => conv.id === conversationId));
  },
  
  getUserConversations: (userId: string): Promise<Conversation[]> => {
    return Promise.resolve(conversations.filter(conv => conv.userId === userId));
  },
  
  createConversation: (userId: string): Promise<Conversation> => {
    const now = new Date();
    const newConversation: Conversation = {
      id: `conv-${conversations.length + 1}`.padStart(7, '0'),
      userId,
      messages: [],
      startedAt: now,
      lastUpdatedAt: now
    };
    conversations.push(newConversation);
    return Promise.resolve(newConversation);
  },
  
  // Message operations
  addMessage: (conversationId: string, content: string, sender: 'user' | 'bot'): Promise<Message> => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) {
      return Promise.reject(new Error('Conversation not found'));
    }
    
    const now = new Date();
    const newMessage: Message = {
      id: `msg-${conversation.messages.length + 1}`.padStart(7, '0'),
      content,
      sender,
      timestamp: now
    };
    
    conversation.messages.push(newMessage);
    conversation.lastUpdatedAt = now;
    
    return Promise.resolve(newMessage);
  },
  
  getMessages: (conversationId: string): Promise<Message[]> => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    return Promise.resolve(conversation?.messages || []);
  }
};
