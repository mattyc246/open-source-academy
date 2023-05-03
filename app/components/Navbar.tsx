import type { User } from '@prisma/client';

import React from 'react';
import styled from 'styled-components';
import { Link } from '@remix-run/react';

import Button from './Button';
import { colors, fontSize, utils } from '~/styles';

interface NavbarProps {
  user?: User | null;
  isHome?: boolean;
}

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 1rem;
  background-color: ${colors.primaryLight};
  box-shadow: ${utils.boxShadow};
`;
const WelcomeMessage = styled.p`
  font-size: ${fontSize.medium};
  margin-right: 1rem;
`;

const Navbar: React.FC<NavbarProps> = ({ user, isHome }) => {
  const isAdmin = user && user.role === 'admin';

  return (
    <Nav>
      {user ? (
        <>
          {isHome ? (
            <Link to="/app">
              <Button>To App</Button>
            </Link>
          ) : (
            <>
              <WelcomeMessage>Welcome back, {user.name}</WelcomeMessage>
              <form action="/logout" method="post">
                <Button type="submit">Logout</Button>
              </form>
            </>
          )}
        </>
      ) : (
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      )}
    </Nav>
  );
};

export default Navbar;
