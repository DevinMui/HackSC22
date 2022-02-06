import React from 'react';
import { useParams } from 'react-router-dom';

const Login = () => {
  const { redirect } = useParams();
  const url = `https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.REACT_APP_GH_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_GH_REDIRECT_URI}#${redirect}`;
  return <a href={url}>Login with GitHub</a>;
};

export default Login;
