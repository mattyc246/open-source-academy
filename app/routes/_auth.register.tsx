import type { V2_MetaFunction } from '@remix-run/react';
import type { ActionArgs, LoaderArgs} from '@remix-run/node';

import React, { useState } from 'react';
import { Link, Form, useActionData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
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
  getUser,
  register
} from '~/utils/session.server';
import {
  validateEmail,
  validateName,
  validatePassword
} from '~/helpers/validationHelpers';
import { setErrorMessage } from '~/utils/message.server';

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

export const action = async ({ request }: ActionArgs) => {
  const session = await getSession(request.headers.get('cookie'));
  const form = await request.formData();
  const password = form.get('password');
  const confirmPassword = form.get('confirmPassword');
  const email = form.get('email');
  const name = form.get('name');
  const acceptTC = form.get('acceptTC');

  if (
    typeof name !== 'string' ||
    typeof password !== 'string' ||
    typeof email !== 'string' ||
    typeof confirmPassword !== 'string'
  ) {
    setErrorMessage(session, 'Form is incomplete');
    return badRequest(session, {
      fieldErrors: null,
      fields: null
    });
  }

  const fields = { password, email, name, confirmPassword };
  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password, confirmPassword),
    name: validateName(name)
  };

  if (!acceptTC) {
    setErrorMessage(session, 'You must accept the Terms & Conditions');
    return badRequest(session, { fieldErrors: null, fields });
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    setErrorMessage(session, 'Registration details contain errors');
    return badRequest(session, {
      fieldErrors,
      fields
    });
  }

  const userExists = await db.user.findFirst({
    where: { email }
  });
  if (userExists) {
    setErrorMessage(session, `User with email ${email} already exists`);
    return badRequest(session, {
      fieldErrors: null,
      fields
    });
  }
  const user = await register({ name, email, password });
  if (!user) {
    setErrorMessage(session, 'Something went wrong while creating the user');
    return badRequest(session, {
      fieldErrors: null,
      fields
    });
  }
  return createUserSession(user.id, '/');
};

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Register | Open Source Academy' }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await getUser(request);

  if (user) {
    return redirect('/');
  }

  return json({});
};

const Register: React.FC = () => {
  const [isTAndCAccepted, setIsTAndCAccepted] = useState<boolean>(false);
  const actionData = useActionData<typeof action>();

  return (
    <Container>
      <AuthCard>
        <Title>Register Account</Title>
        <Form method="POST">
          <TextField
            label="Name"
            name="name"
            defaultValue={actionData?.fields?.name}
            error={actionData?.fieldErrors?.name}
            placeholder="Full name"
          />
          <TextField
            label="Email"
            name="email"
            placeholder="Email Address"
            defaultValue={actionData?.fields?.email}
            error={actionData?.fieldErrors?.email}
            type="email"
          />
          <TextField
            label="Password"
            name="password"
            defaultValue={actionData?.fields?.password}
            error={actionData?.fieldErrors?.password}
            placeholder="Password"
            type="password"
          />
          <TextField
            label="Confirm Password"
            placeholder="Confirm Password"
            defaultValue={actionData?.fields?.confirmPassword}
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
