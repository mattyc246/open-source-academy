import { Outlet } from '@remix-run/react';
import styled from 'styled-components';
import { utils } from '~/styles/utils';

const Main = styled.main`
  min-height: 100vh;
  width: 100vw;
  background: ${utils.primaryCircularGradient};
`;

const Auth = () => {
  return (
    <Main>
      <Outlet />
    </Main>
  );
};

export default Auth;
