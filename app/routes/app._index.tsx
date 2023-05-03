import type { LoaderArgs } from '@remix-run/node';
import type { V2_MetaFunction } from '@remix-run/react';

import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import React from 'react';
import styled from 'styled-components';
import { db } from '~/utils/db.server';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
`;
const Grid = styled.div`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 1rem;
`;
const GridMainCol = styled.div`
  grid-column-start: 1;
  grid-column-end: 7;
`;

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Home | Open Source Academy' }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const courses = await db.course.findMany();

  return json({
    courses
  });
};

const Index: React.FC = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <Container>
      <Grid>
        <GridMainCol></GridMainCol>
      </Grid>
    </Container>
  );
};

export default Index;
