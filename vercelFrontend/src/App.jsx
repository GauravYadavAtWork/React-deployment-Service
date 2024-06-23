import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPage from './components/MainPage';
import ProjectStatusPage from './components/ProjectStatusPage';
import './App.css';
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route path="/project-status" component={ProjectStatusPage} />
      </Switch>
    </Router>
  );
}

export default App;
