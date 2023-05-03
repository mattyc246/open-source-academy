import type { V2_MetaFunction } from '@remix-run/react';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';

import React from 'react';
import styled from 'styled-components';
import { Link, useSearchParams, Form, useActionData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';

import AuthCard from '~/components/ui/AuthCard';
import Button from '~/components/ui/Button';
import TextField from '~/components/ui/TextField';

import { colors, fontSize } from '~/styles';
import { badRequest } from '~/utils/request.server';
import {
  createUserSession,
  getSession,
  getUser,
  login
} from '~/utils/session.server';
import { setErrorMessage } from '~/utils/message.server';
import { validateUrl } from '~/helpers/validationHelpers';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;
const Title = styled.h2`
  margin: 0.5rem 0;
  font-size: ${fontSize.large};
  font-weight: 600;
  color: ${colors.black};
`;
const CardFooter = styled.div`
  font-size: ${fontSize.medium};
  color: ${colors.black};
  text-align: center;
  margin: 1rem 0;
`;

export const action = async ({ request }: ActionArgs) => {
  const session = await getSession(request.headers.get('cookie'));
  const form = await request.formData();
  const password = form.get('password');
  const email = form.get('email');
  const redirectTo = validateUrl((form.get('redirectTo') as string) || '/app');

  const fields = { password, email, redirectTo };

  if (typeof password !== 'string' || typeof email !== 'string') {
    setErrorMessage(session, 'Please provide all values');
    return badRequest(session, { fields });
  }

  const user = await login({ email, password });

  if (!user) {
    setErrorMessage(session, 'Email/Password combination is incorrect');
    return badRequest(session, {
      fields
    });
  }
  return createUserSession(user.id, redirectTo);
};

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Login | Open Source Academy' }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  if (user) {
    return redirect('/');
  }

  return json({});
};

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();

  return (
    <Container>
      <AuthCard>
        <Title>Sign in your account</Title>
        <Form method="post">
          <input
            type="hidden"
            name="redirectTo"
            defaultValue={actionData?.fields.redirectTo}
            value={searchParams.get('redirectTo') ?? undefined}
          />
          <TextField
            label="Email"
            name="email"
            placeholder="Email Address"
            type="email"
          />
          <TextField
            label="Password"
            name="password"
            placeholder="Password"
            type="password"
          />
          <Button type="submit" fullWidth>
            Login
          </Button>
        </Form>
        <CardFooter>
          Need to create an account?
          <br />
          Sign up <Link to="/register">here</Link>
        </CardFooter>
      </AuthCard>
    </Container>
  );
};

export default Login;
