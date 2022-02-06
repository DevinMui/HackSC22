import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { Subtext, H1 } from '../components/common/Text';
import NavBar from '../components/common/NavBar';

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  a:hover {
    text-decoration: none;
  }
`;
const Inner = styled.div`
  text-align: center;
`;
const Peanut = styled.img`
  height: 128px;
  width: 128px;
`;

const LoginButton = styled.div`
  background: #000000;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.12);
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 12px;
  padding-bottom: 12px;
  margin-top: 18px;
  border-radius: 5px;
`;

const Login = () => {
  const { redirect } = useParams();
  const url = `https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.REACT_APP_GH_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_GH_REDIRECT_URI}#${redirect}`;
  return (
    <>
      <Container>
        <Inner>
          <Peanut src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/apple/285/peanuts_1f95c.png" />
          <H1>GitPeanuts</H1>
          <Subtext>Get rewarded for your open-source contributions.</Subtext>
          <a href={url}>
            <LoginButton>Sign in with GitHub</LoginButton>
          </a>
        </Inner>
      </Container>
    </>
  );
};

export default Login;
