import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div 
      className={`message-container ${isUser ? 'user-message' : 'bot-message'}`}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '10px'
      }}
    >
      <div 
        style={{
          maxWidth: '70%',
          padding: '10px 15px',
          borderRadius: '18px',
          backgroundColor: isUser ? '#0084ff' : '#f0f0f0',
          color: isUser ? 'white' : 'black',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ marginBottom: '5px' }}>{message.content}</div>
        <div 
          style={{
            fontSize: '11px',
            color: isUser ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)',
            textAlign: isUser ? 'right' : 'left'
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
