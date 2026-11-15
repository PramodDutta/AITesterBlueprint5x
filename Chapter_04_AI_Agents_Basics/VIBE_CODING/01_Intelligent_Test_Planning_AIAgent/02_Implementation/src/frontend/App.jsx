import React, { useState } from 'react';
import MainPage from './MainPage.jsx';
import SettingsPage from './SettingsPage.jsx';
import { EMPTY_CONFIG } from './envFile.js';

export default function App() {
  const [page, setPage] = useState('main');
  const [config, setConfig] = useState(EMPTY_CONFIG);
  return (
    <div className="app">
      <nav className="nav">
        <span className="brand">Jira Test Plan Generator</span>
        <button className={page === 'main' ? 'tab active' : 'tab'} onClick={() => setPage('main')}>Main page</button>
        <button className={page === 'settings' ? 'tab active' : 'tab'} onClick={() => setPage('settings')}>Settings</button>
      </nav>
      {/* Keep both mounted so input and results survive tab switches. */}
      <div hidden={page !== 'main'}><MainPage config={config} /></div>
      <div hidden={page !== 'settings'}><SettingsPage config={config} setConfig={setConfig} /></div>
    </div>
  );
}
