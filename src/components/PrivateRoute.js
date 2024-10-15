// PrivateRoute.js
import React from 'react';
import { Route, Navigate, useLocation} from 'react-router-dom';

function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem("accessToken") != null;
  //console.log(isAuthenticated);
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;