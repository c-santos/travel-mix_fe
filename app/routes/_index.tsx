import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import axios from 'axios';
import { getSession } from '~/session';

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  // Login
  const response = await axios.get('http://localhost:3005/spotify-auth/login');
  const spotifyAuthUrl = response.data;

  return redirect(spotifyAuthUrl);
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
