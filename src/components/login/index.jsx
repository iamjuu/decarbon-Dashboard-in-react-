import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const LoginWrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
  }
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.p`
  margin-top: 10px;
  text-align: center;
  color: ${({ error }) => (error ? 'red' : 'green')};
`;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Hardcoded user data for admin and staff
  const users = [
    { email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { email: 'staff@example.com', password: 'staff123', role: 'staff' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Both fields are required!');
      setIsError(true);
      return;
    }

    // Simulate login by checking the hardcoded users
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // If user is found, check role and redirect accordingly
      if (user.role === 'admin') {
        console.log('Admin logged in');
        navigate('/'); // Redirect to admin dashboard
      } else if (user.role === 'staff') {
        console.log('Staff logged in');
        navigate('/shaff'); // Redirect to staff dashboard
      }
    } else {
      setMessage('Invalid email or password');
      setIsError(true);
    }
  };

  return (
    <LoginWrapper>
      <Title>Login</Title>
      <Form onSubmit={handleSubmit}>
        <InputWrapper>
          <Label>Email:</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputWrapper>
        <InputWrapper>
          <Label>Password:</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputWrapper>
        <Button type="submit">Login</Button>
        <Link to="/signup">
          <Label>Sign up</Label>
        </Link>
      </Form>
      {message && <Message error={isError}>{message}</Message>}
    </LoginWrapper>
  );
};

export default Login;
