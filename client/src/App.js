import React from 'react';
import './App.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import { baseUrl } from './services/endpoints';
import Routes from './utils/Routes';
import history from './utils/history';

function App() {
  localStorage.setItem('fetchClusters', true);
  let wdawd;

  return (
    <Router history={history}>
      <Routes location={baseUrl} />
      <div>{wdawd.awdgeegsf}</div>
    </Router>
  );
}

export default App;
