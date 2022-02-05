import React from 'react';

const Login = () => {
  const url = `https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.REACT_APP_GH_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_GH_REDIRECT_URI}`;
  return <a href={url}>Login with GitHub</a>;
};

export default Login;
