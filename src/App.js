import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes} from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Aquarium from './components/Aquarium';
import Fishing from './components/Fishing';
import Market from './components/Market';
import Signup from './components/Signup';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <div style={{"background": "#1C1C1C", "height": "100%", "min-height": "100vh", "width": "100vw"}}>
      <Router>
          <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
            <Route path="/aquarium" element={<PrivateRoute><Aquarium/></PrivateRoute>} />
            <Route path="/market" element={<PrivateRoute><Market/></PrivateRoute>} />
            <Route path="/fishing" element={<PrivateRoute><Fishing/></PrivateRoute>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
          </Routes>
      </Router>
    </div>
  );
}

export default App;
