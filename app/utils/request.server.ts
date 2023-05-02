import type { Session } from '@remix-run/node';
import { json } from '@remix-run/node';
import { commitSession } from './session.server';

/**
 * This helper function helps us to return the accurate HTTP status,
 * 400 Bad Request, to the client.
 */
export const badRequest = async <T>(session: Session, data: T) =>
  json(data, {
    status: 400,
    headers: { 'Set-Cookie': await commitSession(session) }
  });
