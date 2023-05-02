import bcrypt from 'bcryptjs';

import { db } from './db.server';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { setSuccessMessage } from './message.server';

type LoginForm = {
  password: string;
  email: string;
};

type RegistrationForm = {
  password: string;
  email: string;
  name: string;
};

export const register = async ({ name, email, password }: RegistrationForm) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      password: passwordHash,
      name,
      email
    }
  });

  return { id: user.id, email };
};

export const login = async ({ email, password }: LoginForm) => {
  const user = await db.user.findUnique({
    where: { email }
  });

  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) return null;

  return { id: user.id, email };
};

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: 'OSA_session',
      secure: process.env.NODE_ENV === 'production',
      secrets: [sessionSecret],
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true
    }
  });

function getUserSession(request: Request) {
  return getSession(request.headers.get('Cookie'));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') {
    return null;
  }
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== 'string') {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      select: { id: true, email: true },
      where: { id: userId }
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect('/login', {
    headers: {
      'Set-Cookie': await destroySession(session)
    }
  });
}

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await getSession();
  session.set('userId', userId);
  setSuccessMessage(session, 'Logged in successfully');
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  });
};
