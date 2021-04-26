import React, { useState } from 'react';
import styled from 'styled-components';

import { Typography, Input, Button } from 'antd';

import { useUserContext } from '../UserContext';

const { Title, Text } = Typography;

const StyledTitle = styled(Title)`
  && {
    margin-bottom: 30px;
  }
`;

const LoginPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledInput = styled(Input)`
  margin: 10px 0;
  width: 300px;
`;

const StyledPasswordInput = styled(Input.Password)`
  margin: 10px 0 20px;
  width: 300px;
`;

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoading } = useUserContext();

  return (
    <LoginPageWrapper>
      <StyledTitle level={2}>Login</StyledTitle>
      <div>
        <div>
          <Text>Username</Text>
        </div>
        <div>
          <StyledInput
            placeholder="Your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <Text>Password</Text>
        </div>
        <div>
          <StyledPasswordInput
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <Button
          type="primary"
          onClick={() => login(username, password)}
          disabled={isLoading}
        >
          Login
        </Button>
      </div>
    </LoginPageWrapper>
  );
}

export default LoginPage;
