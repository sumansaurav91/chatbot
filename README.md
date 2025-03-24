# Chatbot with MCP Client and External API

This project demonstrates a chatbot implementation using React, TypeScript, Claude as an MCP (Message Control Protocol) client, and a connection to an external API.

## Project Structure

- **src/components**: React components for the chatbot UI
- **src/services**: Service modules for different functionalities
- **src/types**: TypeScript interfaces and types
- **src/mockDB**: Mock database implementation

## Key Components

1. **MCP Client**: Uses Claude to process user messages, determine intent, and generate responses
2. **External API**: Connects to external services for additional data
3. **Mock Database**: Simulates data persistence for conversations and users

## Services

- **mcpClientService**: Handles communication with Claude
- **externalApiService**: Manages external API connections
- **mockDBService**: Provides database-like functionality
- **chatbotService**: Orchestrates the entire chat workflow

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Add your Anthropic API key in `src/services/mcpClientService.ts`
4. Start the development server:
   ```
   npm start
   ```

## Development Mode

For development without making actual API calls, the project includes mock implementations:

- Set `REACT_APP_USE_MOCK_MCP=true` to use mock MCP client responses
- Set `REACT_APP_USE_MOCK_API=true` to use mock external API responses

## Extending the Project

- Add authentication for user management
- Implement persistent database storage
- Add more intents and specialized handlers
- Enhance UI with features like typing indicators and message status

## License

MIT
