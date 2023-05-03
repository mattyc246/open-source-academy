import type { V2_MetaFunction } from '@remix-run/react';

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 1rem;
`;

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Admin | Open Source Academy' }];
};

const Index: React.FC = () => {
  return (
    <Container>
      <h1>Admin/Index</h1>
    </Container>
  );
};

export default Index;
