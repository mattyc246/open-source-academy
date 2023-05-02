import type { V2_MetaFunction } from '@remix-run/react';
import type { ActionArgs } from '@remix-run/node';

import React, { useState } from 'react';
import { Link, Form } from '@remix-run/react';
import styled from 'styled-components';

import AuthCard from '~/components/AuthCard';
import Checkbox from '~/components/Checkbox';
import Button from '~/components/Button';
import TextField from '~/components/TextField';

import { colors, fontSize } from '~/styles';
import { badRequest } from '~/utils/request.server';
import { db } from '~/utils/db.server';
import {
  createUserSession,
  getSession,
  register
} from '~/utils/session.server';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;
const CardFooter = styled.div`
  font-size: ${fontSize.medium};
  color: ${colors.black};
  text-align: center;
  margin: 1rem 0;
`;
const Title = styled.h2`
  margin: 0.5rem 0;
  font-size: ${fontSize.large};
  font-weight: 600;
  color: ${colors.black};
`;

function validatePassword(password: string, confirmPW: string) {
  if (password.length < 6) {
    return 'Passwords must be at least 6 characters long';
  } else if (password !== confirmPW) {
    return 'Passwords must be matching';
  }
}

export const action = async ({ request }: ActionArgs) => {
  const session = await getSession(request.headers.get('cookie'));
  const form = await request.formData();
  const password = form.get('password');
  const confirmPassword = form.get('confirmPassword');
  const email = form.get('email');
  const name = form.get('name');

  if (
    typeof name !== 'string' ||
    typeof password !== 'string' ||
    typeof email !== 'string' ||
    typeof confirmPassword !== 'string'
  ) {
    return badRequest(session, {
      fieldErrors: null,
      fields: null,
      formError: 'Form not submitted correctly.'
    });
  }

  const fields = { password, email, name };
  const fieldErrors = {
    password: validatePassword(password, confirmPassword)
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest(session, {
      fieldErrors,
      fields,
      formError: null
    });
  }

  const userExists = await db.user.findFirst({
    where: { email }
  });
  if (userExists) {
    return badRequest(session, {
      fieldErrors: null,
      fields,
      formError: `User with email ${email} already exists`
    });
  }
  const user = await register({ name, email, password });
  if (!user) {
    return badRequest(session, {
      fieldErrors: null,
      fields,
      formError: 'Something went wrong trying to create a new user.'
    });
  }
  return createUserSession(user.id, '/');
};

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Register | Open Source Academy' }];
};

const Register: React.FC = () => {
  const [isTAndCAccepted, setIsTAndCAccepted] = useState<boolean>(false);
  return (
    <Container>
      <AuthCard>
        <Title>Register Account</Title>
        <Form method="POST">
          <TextField label="Name" name="name" placeholder="Full name" />
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
          <TextField
            label="Confirm Password"
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
          />
          <Checkbox
            checked={isTAndCAccepted}
            name="acceptTC"
            onChange={(value) => setIsTAndCAccepted(value)}
          >
            I have read and understand the terms & conditions of registration.
          </Checkbox>
          <Button type="submit" fullWidth>
            Register
          </Button>
        </Form>
        <CardFooter>
          Already registered?
          <br />
          Sign in <Link to="/login">here</Link>
        </CardFooter>
      </AuthCard>
    </Container>
  );
};

export default Register;
