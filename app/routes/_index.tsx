import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  Session,
} from '@remix-run/node';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { Form, Link, useLoaderData } from '@remix-run/react';
import axios from 'axios';
import { commitSession, getSession, isTokenExpired } from '@/session.server';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '@/components/ui/navigation-menu';
import { Music } from 'lucide-react';

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
    <div className="p-4">
      {/* <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              to={'/me/tracks'}
              className={buttonVariants({ variant: 'link' })}
            >
              Tracks
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to={'/me/search'}
              className={buttonVariants({ variant: 'link' })}
            >
              Search
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to={'/me/mix'}
              className={buttonVariants({ variant: 'link' })}
            >
              Mix
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu> */}
      <Card>
        <CardHeader>
          <CardTitle>✈️ Title</CardTitle>
          <CardDescription>Generate your travel playlist.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Form method="post">
            <Button type="submit">Log in with Spotify</Button>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}
