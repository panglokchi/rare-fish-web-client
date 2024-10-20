// Login.js:
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Button, Container, Alert, Card, Stack, Badge, Spinner} from 'react-bootstrap';
import axios from 'axios';
import { login } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL;

function ResetPassword() {
  const [showSpinner, setShowSpinner] = useState(true)
  const [status, setStatus] = useState(null)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({status: "secondary", message: null})
  const [errors, setErrors] = useState('');
  const navigate = useNavigate();
  
  const { token } = useParams();

  const validateForm = () => {
    const newErrors = {};
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (password != confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const verifyToken = async () => {
    try {
      const verifyResponse = await axios.get(`${API_URL}/reset-password/${token}`);
      //setMessage({status: "success", message: ""})
      setStatus("valid") 
      setShowSpinner(false)
    } catch (error) {
      setMessage({status: "warning", message: error.response.data.error})
      setStatus("invalid") 
      setShowSpinner(false)
    }
  }

  useEffect(()=>{
    verifyToken(token);
  }, [])

  const handleSubmit = async (event) => {
    //console.log("attempted to submit")
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      try {
        setErrors({});
        const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
        setMessage({status: "success", message: "Password reset - logging in..."})
        localStorage.setItem("accessToken", response.data.token);
        setShowSpinner(false)
        setTimeout(()=>{
          navigate("/")
        }, 2000)
      } catch (error) {
        setErrors({ form: 'Login failed. Please try again.' });
        setMessage({ status: "warning", message: error.response.data.error})
      }
    }
  };

  return (
    <Container fluid className="text-light pt-2 d-flex justify-content-center align-items-center h-100" data-bs-theme="dark">
      <Card className="mw-50">
        <Card.Header className="text-center"><h1 className="display-1">🐠</h1><h3>Rare Fish Investor Simulator</h3><Badge className="bg-secondary">BETA</Badge></Card.Header>
        { status == "invalid" &&
          <Card.Body>
            <Alert className="p-2 m-0" variant={message.status}>
            {message.message}
            </Alert>
          </Card.Body>
        }
        { status == "valid" &&
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Stack direction="vertical" gap={3}>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!errors.password}
                  disabled={status == "success"}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isInvalid={!!errors.confirmPassword}
                  disabled={status == "success"}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>

              {message.status != "secondary" &&
                <Alert className="p-2 m-0" variant={message.status}>
                  {message.message}
                </Alert>
              }

              <Button variant="primary" type="submit" className="login-button" disabled={status == "success"}>
                Reset Password
              </Button>

            </Stack>
          </Form>
        </Card.Body>}
      </Card>
    </Container>
  );
}

export default ResetPassword;