import React from 'react';
import ReactDOM from 'react-dom';
import SupervisorDashboard from './SupervisorDashboard';
import { HelpRequestsProvider } from './contexts/HelpRequestsContext';
import { KnowledgeBaseProvider } from './contexts/KnowledgeBaseContext';

function App() {

  return (
    <HelpRequestsProvider>
      <KnowledgeBaseProvider>
        <SupervisorDashboard />
      </KnowledgeBaseProvider>
    </HelpRequestsProvider>
  );
}
export default App;