import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/node';
import getProfile from '@/apis/spotify/getProfile';
import { getSession } from '@/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get('cookie'));
  const token = session.get('accessToken');

  try {
    return await getProfile(token!);
  } catch (error) {
    throw Error('Could not get Profile data.', {
      cause: token,
    });
  }
}

const Me: React.FC = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.8 }}>
      <h1> Profile </h1>
      <img
        src={data.images[0].url}
        height={data.images[0].height}
        width={data.images[0].width}
        alt="display"
      />
      <h2>
        <a href={data.external_urls.spotify}>{data.display_name}</a>
      </h2>
      <ul>
        <li>Followers: {data.followers.total}</li>
        <li>{data.country}</li>
        <li>{data.email}</li>
      </ul>
      <Link to={'/me/tracks'}>Tracks</Link>
      <br />
      <Link to={'/me/search'}>Search</Link>
      <br />
      <Link to={'/me/mix'}>Mix</Link>
      <Outlet />
    </div>
  );
};

export default Me;
