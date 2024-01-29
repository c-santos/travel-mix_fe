import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  Session,
} from '@remix-run/node';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import axios from 'axios';
import { commitSession, getSession, isTokenExpired } from '@/session.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Travel Mix' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  try {
    const response = await axios.get(
      'http://localhost:3005/spotify-auth/login',
    );
    const spotifyAuthUrl = response.data;
    return redirect(spotifyAuthUrl);
  } catch (error) {
    throw new Error('Could not initiate login process', {
      cause: error,
    });
  }
}

export async function isLoggedIn(cookieHeader: string | null) {
  let session = await getSession(cookieHeader);
  const tokenExpiryDate = session.get('expires');

  let isLoggedIn;

  if (await isTokenExpired(tokenExpiryDate!)) {
    isLoggedIn = false;
  } else {
    isLoggedIn = true;
  }

  return isLoggedIn;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get('cookie');
  return (await isLoggedIn(cookieHeader)) ? redirect('/me/tracks') : null;
}

export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <Form method="post">
        <button type="submit">Log in to Spotify</button>
      </Form>
    </div>
  );
}
