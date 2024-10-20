// Login.js:
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Container, Alert, Card, Stack, Badge, Spinner} from 'react-bootstrap';
import axios from 'axios';
import { login } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL;

function Verify() {
  const [message, setMessage] = useState({status: "secondary", message: null})
  const [showSpinner, setShowSpinner] = useState(true)
  const [errors, setErrors] = useState('');
  const navigate = useNavigate();

  const { token } = useParams();

  const verifyAccount = async (token) => {
    try {
      const verifyResponse = await axios.post(`${API_URL}/verify/${token}`);
      setMessage({status: "success", message: "Account Verified - Redirecting..."})
      localStorage.setItem("accessToken", verifyResponse.data.token);
      setShowSpinner(false)
      setTimeout(()=>{
        navigate("/")
      }, 2000)
    } catch (error) {
      setMessage({status: "warning", message: error.response.data.error})
      setShowSpinner(false)
    }
  }

  useEffect(()=>{
    verifyAccount(token);
  }, [])

  return (
    <Container fluid className="text-light pt-2 d-flex justify-content-center align-items-center h-100" data-bs-theme="dark">
      <Card className="mw-50">
        <Card.Header className="text-center"><h1 className="display-1">🐠</h1><h3>Rare Fish Investor Simulator</h3><Badge className="bg-secondary">BETA</Badge></Card.Header>
        <Card.Body>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <h5>Account Verification</h5>
            {showSpinner && <Spinner></Spinner>}
            <Alert className="p-2" variant={message.status} show={true}>
              {message.message}
            </Alert>

          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Verify;