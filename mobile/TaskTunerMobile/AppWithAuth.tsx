import React from 'react';
import { TaskTunerClerkProvider } from './src/contexts/ClerkProvider';
import App from './App';

export default function AppWithAuth() {
  return (
    <TaskTunerClerkProvider>
      <App />
    </TaskTunerClerkProvider>
  );
}
