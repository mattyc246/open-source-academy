import type { V2_MetaFunction } from '@remix-run/react';
import type { ActionArgs } from '@remix-run/node';

import React from 'react';
import styled from 'styled-components';
import { Link, useSearchParams, Form } from '@remix-run/react';

import AuthCard from '~/components/AuthCard';
import Button from '~/components/Button';
import TextField from '~/components/TextField';

import { colors, fontSize } from '~/styles';
import { badRequest } from '~/utils/request.server';
import { createUserSession, getSession, login } from '~/utils/session.server';
import { setErrorMessage, setSuccessMessage } from '~/utils/message.server';

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

function validatePassword(password: string) {
  if (password.length < 6) {
    return 'Passwords must be at least 6 characters long';
  }
}

function validateUrl(url: string) {
  const urls = ['/'];
  if (urls.includes(url)) {
    return url;
  }
  return '/';
}

export const action = async ({ request }: ActionArgs) => {
  const session = await getSession(request.headers.get('cookie'));
  const form = await request.formData();
  const password = form.get('password');
  const email = form.get('email');
  const redirectTo = validateUrl((form.get('redirectTo') as string) || '/');

  if (typeof password !== 'string' || typeof email !== 'string') {
    setErrorMessage(session, 'Please provide all values');
    return badRequest(session, {
      fieldErrors: null,
      fields: null,
      formError: 'Form not submitted correctly.'
    });
  }

  const fields = { password, email };
  const fieldErrors = {
    password: validatePassword(password)
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest(session, {
      fieldErrors,
      fields,
      formError: null
    });
  }
  const user = await login({ email, password });

  if (!user) {
    setErrorMessage(session, 'Email/Password combination is incorrect');
    return badRequest(session, {
      fieldErrors: null,
      fields,
      formError: `Email/Password combination is incorrect`
    });
  }
  return createUserSession(user.id, redirectTo);
};

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Login | Open Source Academy' }];
};

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  return (
    <Container>
      <AuthCard>
        <Title>Sign in your account</Title>
        <Form method="post">
          <input
            type="hidden"
            name="redirectTo"
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
