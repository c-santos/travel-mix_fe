import { createCookieSessionStorage } from '@remix-run/node';
import { Session } from '@remix-run/node';
import IUserToken from './constants/user-token.interface';

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<IUserToken>({
    cookie: {
      name: 'user-session',
    },
  });

// export async function useUserToken(cookieHeader: string) {
//   let session: Session<IUserToken> = await getSession('cookie');
//   console.log(session);

//   const token: IUserToken = {
//     accessToken: session.get('accessToken'),
//     expires: session.get('expires'),
//     refreshToken: session.get('refreshToken'),
//   };

//   console.log(token);
//   console.log(session.data);

//   if (
//     !token.accessToken ||
//     typeof token.accessToken !== 'string' ||
//     !token.expires ||
//     typeof token.expires !== 'string' ||
//     !token.refreshToken ||
//     typeof token.refreshToken !== 'string'
//   ) {
//     return null;
//   }

//   return token;
// }

export async function isTokenExpired(expiryDate: string) {
  const isTokenExpired: boolean = new Date(Date.now()) > new Date(expiryDate);

  return isTokenExpired;
}

export async function refreshToken() {
  return;
}
