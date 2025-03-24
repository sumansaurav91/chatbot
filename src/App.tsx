import React, { useEffect, useState } from 'react';
import ChatWindow from './components/ChatWindow';
import { mockDBService } from './services/mockDBService';

function App() {
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // On component mount, get or create a user
  useEffect(() => {
    const initializeUser = async () => {
      setIsLoading(true);
      try {
        // For simplicity, we'll use a fixed user
        // In a real app, you'd handle authentication
        const user = await mockDBService.getUser('user-001');
        
        if (user) {
          setUserId(user.id);
        } else {
          // Create a new user if none exists
          const newUser = await mockDBService.createUser('Guest User');
          setUserId(newUser.id);
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <header style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1>AI Chatbot with MCP Client & External API</h1>
        <p>A demonstration of a chatbot using Claude as MCP and connected to external APIs</p>
      </header>
      
      <main style={{ height: 'calc(100vh - 150px)' }}>
        {userId && <ChatWindow userId={userId} />}
      </main>
    </div>
  );
}

export default App;
