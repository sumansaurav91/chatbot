import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        padding: '10px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f9f9f9'
      }}
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        style={{
          flex: 1,
          padding: '10px 15px',
          border: '1px solid #ccc',
          borderRadius: '18px',
          fontSize: '14px',
          marginRight: '10px'
        }}
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0084ff',
          color: 'white',
          border: 'none',
          borderRadius: '18px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: message.trim() && !disabled ? 'pointer' : 'not-allowed',
          opacity: message.trim() && !disabled ? 1 : 0.7
        }}
      >
        Send
      </button>
    </form>
  );
};

export default ChatInput;
