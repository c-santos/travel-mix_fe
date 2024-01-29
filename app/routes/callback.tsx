import React from 'react';
import { LoaderFunctionArgs, Session, redirect } from '@remix-run/node';
import axios, { AxiosRequestConfig } from 'axios';
import { commitSession, getSession } from '@/session.server';
import ICallbackToken from '@/constants/callback-token.interface';
import IUserToken from '@/constants/user-token.interface';

async function getUserAccessToken(code: string) {
  // Sends GET request to backend to generate access token
  // Auth code is parameter

  const config: AxiosRequestConfig = {
    params: {
      auth_code: code,
    },
  };

  try {
    const response = await axios.get(
      `${process.env.API_BASE_URL}/spotify-auth/callback`,
      config,
    );
    const accessToken: ICallbackToken = response.data;

    return accessToken;
  } catch (error) {
    throw new Response('Could not generate access token.', {
      status: 500,
    });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const reqUrl: URL = new URL(request.url);
  let authCode: string | null;

  if (reqUrl.searchParams.get('error')) {
    // If an error exists
    return redirect('/');
  } else {
    authCode = reqUrl.searchParams.get('code');
    if (!authCode) {
      throw new Response('Authorization code not present in URL.', {
        status: 500,
      });
    }
  }

  const token = await getUserAccessToken(authCode);

  // Load session
  if (token) {
    let session: Session<IUserToken> = await getSession();

    session.set('accessToken', token.access_token);
    session.set(
      'expires',
      new Date(Date.now() + Number(token.expires_in) * 1000).toISOString(),
    );
    session.set('refreshToken', token.refresh_token);

    try {
      return redirect('/me/tracks', {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      });
    } catch (error) {
      throw new Response('Session did not commit.', {
        status: 500,
      });
    }
  }
}

const Callback = () => {
  return (
    <div>
      <h3>Logging in...</h3>
    </div>
  );
};

export default Callback;
