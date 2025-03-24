import axios from 'axios';
import { ApiResponse } from '../types';

// Mock API endpoint
const API_BASE_URL = 'https://api.example.com';

export const externalApiService = {
  // Get data from external API
  getData: async <T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> => {
    try {
      // For development, we'll use mock implementation
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK_API === 'true') {
        return mockGetData<T>(endpoint, params);
      }
      
      const response = await axios.get(`${API_BASE_URL}/${endpoint}`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
      return {
        success: false,
        error: 'Failed to fetch data from external API'
      };
    }
  },
  
  // Post data to external API
  postData: async <T>(endpoint: string, data: any): Promise<ApiResponse<T>> => {
    try {
      // For development, we'll use mock implementation
      if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK_API === 'true') {
        return mockPostData<T>(endpoint, data);
      }
      
      const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error(`Error posting data to ${endpoint}:`, error);
      return {
        success: false,
        error: 'Failed to send data to external API'
      };
    }
  }
};

// Mock API implementation
function mockGetData<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => {
      // Mock responses based on endpoint
      if (endpoint === 'weather') {
        resolve({
          success: true,
          data: {
            location: params?.city || 'Unknown',
            temperature: 72,
            condition: 'Sunny',
            forecast: [
              { day: 'Monday', high: 75, low: 60, condition: 'Partly Cloudy' },
              { day: 'Tuesday', high: 78, low: 62, condition: 'Sunny' }
            ]
          } as unknown as T
        });
      } else if (endpoint === 'products') {
        resolve({
          success: true,
          data: [
            { id: 1, name: 'Laptop', price: 999.99 },
            { id: 2, name: 'Smartphone', price: 699.99 },
            { id: 3, name: 'Headphones', price: 149.99 }
          ] as unknown as T
        });
      } else {
        resolve({
          success: false,
          error: `Unknown endpoint: ${endpoint}`
        });
      }
    }, 300); // Simulate 300ms delay
  });
}

function mockPostData<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => {
      // Mock responses based on endpoint
      if (endpoint === 'feedback') {
        resolve({
          success: true,
          data: {
            id: Math.floor(Math.random() * 1000),
            ...data,
            receivedAt: new Date().toISOString()
          } as unknown as T
        });
      } else if (endpoint === 'orders') {
        resolve({
          success: true,
          data: {
            orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
            items: data.items,
            total: data.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
            status: 'pending',
            createdAt: new Date().toISOString()
          } as unknown as T
        });
      } else {
        resolve({
          success: false,
          error: `Unknown endpoint: ${endpoint}`
        });
      }
    }, 300); // Simulate 300ms delay
  });
}
