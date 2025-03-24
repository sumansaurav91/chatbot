import React, { useEffect, useRef, useState } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { chatbotService } from '../services/chatbotService';

interface ChatWindowProps {
  userId: string;
  conversationId?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ userId, conversationId: initialConversationId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation
  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true);
      try {
        // Create a new conversation if one wasn't provided
        if (!initialConversationId) {
          const newConversationId = await chatbotService.createConversation(userId);
          setConversationId(newConversationId);
        } else {
          setConversationId(initialConversationId);
          
          // Load existing messages
          const existingMessages = await chatbotService.getConversationMessages(initialConversationId);
          setMessages(existingMessages);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [userId, initialConversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText: string) => {
    if (!conversationId) return;
    
    setIsLoading(true);
    try {
      // Add user message to UI immediately
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        content: messageText,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Process message through our chatbot service
      const botResponse = await chatbotService.processUserMessage(conversationId, messageText);
      
      // Refresh messages from service to get properly stored messages with IDs
      const updatedMessages = await chatbotService.getConversationMessages(conversationId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message if processing failed
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "Sorry, there was an error processing your message. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div 
        style={{
          padding: '15px',
          backgroundColor: '#0084ff',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        }}
      >
        AI Chatbot
      </div>
      
      <div 
        style={{
          flex: 1,
          padding: '15px',
          overflowY: 'auto',
          backgroundColor: '#fff'
        }}
      >
        {messages.length === 0 ? (
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#888',
              textAlign: 'center'
            }}
          >
            <p>Start a conversation by sending a message!</p>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isLoading || !conversationId}
      />
    </div>
  );
};

export default ChatWindow;
