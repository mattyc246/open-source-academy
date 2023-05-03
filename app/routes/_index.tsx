import type { LoaderArgs, V2_MetaFunction } from '@remix-run/node';
import type { User } from '@prisma/client';

import styled from 'styled-components';

import Navbar from '~/components/ui/Navbar';

import { json } from '@remix-run/node';
import { getUser } from '~/utils/session.server';
import { useLoaderData } from '@remix-run/react';

const Box = styled.div`
  height: 100vh;
  width: 100vw;
`;

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Open Source Academy' }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  return json({ user });
};

const Index: React.FC = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <Box>
      <Navbar user={data.user as User} isHome />
    </Box>
  );
};

export default Index;
