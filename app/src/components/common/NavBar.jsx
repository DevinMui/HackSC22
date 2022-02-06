import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/auth';
import { H1, Subtext } from './Text';
import SearchBar from './SearchBar';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: inherit;
  padding: 16px;
  * {
    height: inherit;
    display: flex;
    align-items: center;
  }
`;

const LinkContainer = styled.div`
  margin-left: 16px;
  height: inherit;
  display: flex;
  align-items: center;
  * {
    margin-left: 8px;
    margin-right: 8px;
  }
`;

const authLinks = [
  { to: '/dash', text: 'Repos' },
  { to: '/dash', text: 'Explore' },
  { to: '', text: 'Payments' },
];

const links = [
  { to: '', text: 'Learn' },
  { to: '', text: 'Explore' },
];

const NavBar = ({ onSearch }) => {
  const auth = useAuth();
  return (
    <Container>
      <div>
        <Link to="/dash">
          <H1>GitPeanuts</H1>
        </Link>
        <LinkContainer>
          {(auth.user ? authLinks : links).map((link) => (
            <Link to={link.to} key={link.text}>
              {link.text}
            </Link>
          ))}
        </LinkContainer>
      </div>
      <div>
        {auth.user && <SearchBar placeholder="Search for users, repos..." />}
        <Link
          to={auth.user ? '/' : '/login'}
          onClick={auth.user ? auth.logout : undefined}
        >
          <Subtext>Log {auth.user ? 'out' : 'in'}</Subtext>
        </Link>
      </div>
    </Container>
  );
};

export default NavBar;
