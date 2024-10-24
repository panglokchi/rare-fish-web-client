// Login.js:
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Form, Button, Container, Alert, Card, Stack, Badge} from 'react-bootstrap';
import axios from 'axios';
import { login } from '../utils/auth';
import AuctionMarquee from './AuctionMarquee';

const API_URL = process.env.REACT_APP_API_URL;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({status: "secondary", message: null})
  const [errors, setErrors] = useState('');
  const navigate = useNavigate();
  const routeChange = () =>{ 
    let path = "/"; 
    navigate(path);
  }

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 3) newErrors.password = 'Password must be at least 3 characters';
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
        const userData = await login(email, password);
        //console.log('Login successful:', userData);
        routeChange();
      } catch (error) {
        setErrors({ form: 'Login failed. Please try again.' });
        setMessage({ status: "warning", message: error.response.data.error})
      }
    }
  };

  const registerGuest = async () => {
    const response = await axios.post(`${API_URL}/create-guest`);
    localStorage.setItem("accessToken", response.data.token);
    navigate("/")
  }

  return (
    <Container fluid className="overflow-y-auto overflow-x-hidden text-light pt-2 d-flex flex-column justify-content-center align-items-center h-100" data-bs-theme="dark">
      <div className="mb-3">
        <AuctionMarquee></AuctionMarquee>
      </div>
      <Card className="mw-50 mb-4">
        <Card.Header className="text-center"><h1 className="display-1">🐠</h1><h3>Rare Fish Investor Simulator</h3><Badge className="bg-secondary">BETA</Badge></Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Stack direction="vertical" gap={3}>
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

              {message.status != "secondary" &&
                <Alert className="p-2 m-0" variant={message.status}>
                  {message.message}
                </Alert>
              }

              <a href="/forgot-password">Forgot Password?</a>

              <Button variant="primary" type="submit" className="login-button">
                Login
              </Button>
              <div className="d-flex">
                <Button variant="secondary" className="signup-button w-50 me-1" onClick={()=>{navigate("/signup")}}>
                  Sign Up
                </Button>
                <Button variant="secondary" className="guest-button w-50 ms-1" onClick={()=>{registerGuest()}}>
                  Play as Guest
                </Button>
              </div>
              
            </Stack>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;