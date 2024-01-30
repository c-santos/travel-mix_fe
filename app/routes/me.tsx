import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import getProfile from '@/apis/spotify/getProfile';
import { getSession } from '@/session.server';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shuffle } from 'lucide-react';

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get('cookie'));
  const token = session.get('accessToken');

  try {
    return await getProfile(token!);
  } catch (error) {
    return redirect('/');
  }
}

const Me: React.FC = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="p-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Button variant={'link'} asChild>
              <Link to={'/me/tracks'}>Tracks</Link>
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant={'link'} asChild>
              <Link to={'/me/search'}>Search</Link>
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button variant={'link'} asChild>
              <Link to={'/me/mix'}>Mix</Link>
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Card>
        <CardHeader>
          <Avatar>
            <AvatarImage src={data.images[0].url} />
            <AvatarFallback>CS</AvatarFallback>
          </Avatar>
          <CardTitle>{data.display_name}</CardTitle>
          <CardDescription>Your Profile</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="[&>li]:mt-2">
            <li>
              <div className="font-semibold">Followers</div>
              {data.followers.total}
            </li>
            <li>
              <div className="font-semibold">Region</div>
              {data.country}
            </li>
            <li>
              <div className="font-semibold">Email</div>

              {data.email}
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant={'default'} asChild>
            <a href={data.external_urls.spotify}>Go to Spotify</a>
          </Button>
        </CardFooter>
      </Card>
      <Outlet />
    </div>
  );
};

export default Me;
