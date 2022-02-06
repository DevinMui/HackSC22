import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import NavBar from '../components/common/NavBar';
import { useAuth } from '../context/auth';

const Landing = () => {
  const nav = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    nav('/dash');
  }, []);
  return (
    <>
      <NavBar />
      <div>Make peanut</div>
    </>
  );
};
export default Landing;
