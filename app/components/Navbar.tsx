import React from 'react';
import styled from 'styled-components';
import { Link } from '@remix-run/react';

import Button from './Button';

interface NavbarProps {
  isLoggedIn?: boolean;
}

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
`;

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn }) => {
  return (
    <Nav>
      {isLoggedIn ? (
        <form action="/logout" method="post">
          <Button type="submit">Logout</Button>
        </form>
      ) : (
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      )}
    </Nav>
  );
};

export default Navbar;
