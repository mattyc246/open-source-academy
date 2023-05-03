import type { LoaderArgs } from '@remix-run/node';
import type { User } from '@prisma/client';

import React from 'react';
import styled from 'styled-components';
import { Outlet, useLoaderData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';

import Navbar from '~/components/ui/Navbar';

import { getUser } from '~/utils/session.server';

const Main = styled.main`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`;

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  if (!user) redirect('/login');

  return json({ user });
};

const App: React.FC = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <Main>
      <Navbar user={data.user as User} />
      <Outlet />
    </Main>
  );
};

export default App;
