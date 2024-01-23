import { createCookieSessionStorage } from '@remix-run/node';

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: 'user-session',
    },
  });

// TODO: Get Access Token hook
export async function getTokenCookie() {
  return;
}

export async function refreshTokenCookie() {
  return;
}
// TODO:
