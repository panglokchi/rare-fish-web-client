// PrivateRoute.js
import React, { useState, useEffect } from 'react';
import { Route, Navigate, useLocation} from 'react-router-dom';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
  };

  const checkToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/`, config)
      setAuth(true)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setAuth(false)
      setLoading(false)
    }
  }

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <>
      {auth && children}
      {loading && !auth && <></>}
      {!loading && !auth && <Navigate to="/login" />}
    </>
  )
}

export default PrivateRoute;