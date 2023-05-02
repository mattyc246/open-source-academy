import type { LinksFunction, LoaderArgs } from '@remix-run/node';
import type { ToastMessage } from './utils/message.server';

import React, { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react';
import { json } from '@remix-run/node';

import { commitSession, getSession } from './utils/session.server';

import globalStyles from './styles/global.css';
import resetCss from './styles/reset.css';


export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: resetCss },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap'
  },
  { rel: 'stylesheet', href: globalStyles }
];

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request.headers.get('cookie'));

  const toastMessage = session.get('toastMessage') as ToastMessage;

  if (!toastMessage) {
    return json({ toastMessage: null });
  }

  if (!toastMessage.type) {
    throw new Error('Message should have a type');
  }

  return json(
    { toastMessage },
    { headers: { 'Set-Cookie': await commitSession(session) } }
  );
};

const App: React.FC = () => {
  const { toastMessage } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const { message, type } = toastMessage;

    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      default:
        throw new Error(`${type} is not handled`);
    }
  }, [toastMessage]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {typeof document === 'undefined' ? '__STYLES__' : null}
      </head>
      <body>
        <Outlet />
        <Toaster />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
};

export default App;
