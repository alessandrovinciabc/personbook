import React from 'react';

import styled from 'styled-components';
import CenteredContainer from '../components/containers/CenteredContainer';
import AbsolutelyCentered from '../components/wrappers/AbsolutelyCentered';
import Card from '../components/containers/Card';

import GoogleLogo from '../assets/images/google.png';
import GithubLogo from '../assets/images/github.png';

let LoginHeader = styled.h1`
  font-weight: bold;
  font-size: 1.7rem;
  letter-spacing: 2px;

  user-select: none;
  margin-bottom: 1rem;
`;

let LoginSubHeader = styled.h2`
  color: rgba(0, 0, 0, 0.3);
  font-size: 0.8rem;

  margin-bottom: 1rem;
`;

let LoginOption = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;

  text-decoration: none;
  color: rgba(0, 0, 0, 0.7);
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 0.4rem;

  margin: 0.5rem 0;

  &:hover {
    color: rgba(0, 0, 0, 0.9);
    background-color: rgb(245, 245, 245);
  }
`;

let SocialLogo = styled.img`
  width: 2.5rem;
  margin-right: 1rem;
`;

function LoginPage(props) {
  return (
    <AbsolutelyCentered>
      <CenteredContainer>
        <Card>
          <LoginHeader>Welcome to PersonBook🧑📕</LoginHeader>
          <LoginSubHeader>Please, select an option:</LoginSubHeader>
          <LoginOption href="/api/auth/github">
            <SocialLogo src={GithubLogo} />
            Sign in with GitHub
          </LoginOption>
          <LoginOption href="/api/auth/google">
            <SocialLogo src={GoogleLogo} />
            Sign in with Google
          </LoginOption>
        </Card>
      </CenteredContainer>
    </AbsolutelyCentered>
  );
}

export default LoginPage;
