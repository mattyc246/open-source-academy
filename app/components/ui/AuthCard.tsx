import type { PropsWithChildren } from 'react';

import React from 'react';
import styled from 'styled-components';

import { breakpoints, colors, utils } from '~/styles';

const Card = styled.div`
  background-color: ${colors.white};
  padding: 1rem 1.5rem;
  box-shadow: ${utils.boxShadow};
  max-width: 450px;
  min-width: 300px;
  border-radius: 0.25rem;

  @media screen and (min-width: ${breakpoints.md}) {
    min-width: 500px;
    max-width: 650px;
  }
`;

const AuthCard: React.FC<PropsWithChildren> = ({ children }) => {
  return <Card>{children}</Card>;
};

export default AuthCard;
