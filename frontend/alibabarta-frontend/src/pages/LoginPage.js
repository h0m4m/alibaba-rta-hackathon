import React from 'react';
import LoginForm from '../components/loginform';

const LoginPage = ({ onLogin }) => {
  return (
    <div>
      <LoginForm onLogin={onLogin} />
    </div>
  );
};

export default LoginPage;
