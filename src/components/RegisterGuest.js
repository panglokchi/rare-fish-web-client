import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Form, Button, Container, Alert, Card, Stack, Badge, Modal} from 'react-bootstrap';
import axios from 'axios';
import { register } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL;

function RegisterGuest({show, onHide, updatePlayerData = null}) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState('');
    const navigate = useNavigate();
    const routeChange = () =>{ 
      let path = "/"; 
      navigate(path);
    }

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    else if (username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (password != confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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
        const response = await axios.post(`${API_URL}/user/register-guest/`, {username, email, password}, config);
        //console.log('Login successful:', userData);
        setSuccess(true)
        setMessage("Success! Verify your email to proceed.")
        //setTimeout(routeChange, 2000)
      } catch (error) {
        setSuccess(false)
        setMessage(error.response.data.error)
      }
    }
  };


  const reset = () => {
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setEmail('')
  }

  return (
    <Modal
        className="text-light p-0"
        data-bs-theme="dark"
        show={show}
        //size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        //onEscapeKeyDown={()=>{reset(); onHide()}}
        onHide={()=>{ reset(); onHide() }}
        onShow={()=>{}}
      >
      <Modal.Header closeButton onClick={()=>{reset(); onHide()}}>
        <Modal.Title className="d-block d-sm-none" id="contained-modal-title-vcenter" style={{fontSize: "1rem"}}>
          Register your Account
        </Modal.Title>
        <Modal.Title className="d-none d-md-block" id="contained-modal-title-vcenter">
            Register your Account
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-2 p-md-3">
        <div className="mb-1" style={{fontSize: "1.05rem"}}>ℹ️Register your account to keep your progress.</div>
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
                disabled={success}
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
                disabled={success}
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
                disabled={success}
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
                    disabled={success}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" className="login-button" disabled={success}>
                Register Account
            </Button>

            <Alert show={message} variant={success ? "success" : "warning"} className="m-0">
                {message}
            </Alert>
            
            </Stack>
        </Form>
        

      </Modal.Body>
      {/*<Modal.Footer className="p-1 p-md-2">
        
        <Button className="px-2 py-1 py-md-2 px-md-3" onClick={()=>{reset(); onHide()}} variant="outline-danger">Close</Button>
      </Modal.Footer>*/}
    </Modal>
  )
}

export default RegisterGuest;