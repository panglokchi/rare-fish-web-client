// Login.js:
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Form, Button, Container, Alert, Card, Stack, Badge} from 'react-bootstrap';
import axios from 'axios';
import { register } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL;

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState('');
  const navigate = useNavigate();
  const routeChange = () =>{ 
    let path = "/"; 
    navigate(path);
  }

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    else if (username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSubmit = async (event) => {
    //console.log("attempted to submit")
    event.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      try {
        setErrors({});
        //console.log('Login attempted with:', { email, password });
        const response = await register(username, email, password);
        //console.log('Login successful:', userData);
        setSuccess(true)
        setMessage("Success! Redirecting to login...")
        setTimeout(routeChange, 2000)
      } catch (error) {
        setMessage(error.response.data.error)
        setErrors({ form: 'Registration failed. Please try again.' });
      }
    }
  };

  return (
    <Container fluid className="text-light pt-2 d-flex justify-content-center align-items-center h-100" data-bs-theme="dark">
      <Card className="mw-50">
        <Card.Header className="text-center"><h1 className="display-1">🐠</h1><h3>Rare Fish Investor Simulator</h3><Badge className="bg-secondary">BETA</Badge></Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Stack direction="vertical" gap={3}>

            <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="Username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" className="login-button">
                Sign Up
              </Button>
              <Alert show={message} variant={success ? "success" : "warning"}>
                {message}
              </Alert>
            </Stack>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Signup;