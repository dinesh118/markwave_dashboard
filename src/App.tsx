import React from 'react';
import HealthStatus from './components/HealthStatus';
import UserTabs from './components/UserTabs';

function App() {
  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="title">Markwave Dashboard</h1>
            <HealthStatus />
          </div>
        </div>
      </header>

      <UserTabs />
    </div>
  );
}

export default App;
