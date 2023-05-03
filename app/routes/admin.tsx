import type { LoaderArgs } from '@remix-run/node';
import type { User } from '@prisma/client';

import styled from 'styled-components';
import { json, redirect } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

import Navbar from '~/components/ui/Navbar';

import { getUser } from '~/utils/session.server';

const Main = styled.main`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`;

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  if (!user) return redirect('/login');

  if (user?.role !== 'admin') {
    return redirect('/app');
  }

  return json({ user });
};

const Admin = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <Main>
      <Navbar user={data.user as User} />
      <Outlet />
    </Main>
  );
};

export default Admin;
