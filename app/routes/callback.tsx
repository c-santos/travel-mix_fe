import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import React from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { commitSession, getSession } from '~/session';

export interface IToken {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: string;
  refresh_token: string;
}

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
    const accessToken: IToken = response.data;

    return accessToken;
  } catch (error) {
    console.error(error);
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
    let session = await getSession();
    
    session.set('access_token', token.access_token);
    session.set(
      'expires',
      new Date(Date.now() + Number(token.expires_in) * 1000).toISOString(),
    );
    session.set('refresh_token', token.refresh_token);

    try {
      return redirect('/me/tracks', {
        headers: {
          'Set-Cookie': await commitSession(session),
        },
      });
    } catch (error) {
      console.error(error);
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
