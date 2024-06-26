import React, { FC, useContext, useState } from "react";
import styled from 'styled-components';
import { observer } from "mobx-react-lite";
import { Context } from "..";


const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin: 50px auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  background: white;
`;

const StyledInput = styled.input`
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  margin: 10px 0;
  border-radius: 5px;
  border: none;
  color: white;
  background: #0d6efd; // Bootstrap primary blue
  cursor: pointer;
  width: 100%;
`;

const LoginForm: FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const {store} = useContext(Context);

    return (
        <FormContainer>
          <StyledInput 
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            placeholder="Email"
          /> 
          <StyledInput 
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
          />  
          <StyledButton 
            onClick={() => store.login(email, password)}
          >
            Login
          </StyledButton>
        </FormContainer>
    )
}

export default observer(LoginForm);
