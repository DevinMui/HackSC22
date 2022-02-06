import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../api/github';
import { useAuth } from '../context/auth';

const GhRedirect = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [message, setMessage] = useState('Logging you into GitPeanuts...');
  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes('?code=');
    if (hasCode) {
      const sp = url.split('?code=')[1];
      let redir = '/dash';
      if (window.location.hash) {
        try {
          redir = atob(window.location.hash.substr(1));
        } catch (e) {
          redir = '/dash';
        }
      }
      getToken(sp.split('#')[0]).then((tok) => {
        setMessage('Login successful! Redirecting you to GitPeanuts...');
        auth.login(tok);
        window
          .setTimeout(() => {
            navigate(redir);
          }, 2000)
          .catch(() => {
            setMessage('Login unsuccessful, redirecting...');
            auth.logout();
            window.setTimeout(() => navigate('/'), 2000);
          });
      });
    } else {
      auth.logout();
      window.setTimeout(() => navigate(-2), 2000);
    }
  }, [window.location.href]);
  // If Github API returns the code parameter
  return <div>{message}</div>;
};

export default GhRedirect;
