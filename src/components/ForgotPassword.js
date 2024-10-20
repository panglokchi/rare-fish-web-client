// Login.js:
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Form, Button, Container, Alert, Card, Stack, Badge} from 'react-bootstrap';
import axios from 'axios';
import { login } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL;

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({status: "secondary", message: null})
  const [success, setSuccess] = useState(false);
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
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        //console.log('Login successful:', userData);
        setMessage({ status: "success", message: response.data.message})
        setSuccess(true)
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
                  disabled={success}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              {message.status != "secondary" &&
                <Alert className="p-2 m-0" variant={message.status}>
                  {message.message}
                </Alert>
              }

              <Button variant="primary" type="submit" className="login-button" disabled={success}>
                Reset Password
              </Button>

            </Stack>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ForgotPassword;