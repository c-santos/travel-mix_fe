import {
  LoaderFunctionArgs,
} from '@remix-run/node';
import { Outlet, useLoaderData, Link } from '@remix-run/react';
import axios from 'axios';
import { getSession } from '~/session';
import { SpotifyProfile } from '~/spotify.interfaces';

async function getProfile(accessToken: string) {
  try {
    const response = await axios.get(`${process.env.SPOTIFY_API_BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const profileData: SpotifyProfile = response.data;

    return profileData;
  } catch (error) {
    console.error(error);
    throw new Error('Profile data load error.');
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get('cookie'));

  const token = session.data;

  return await getProfile(token.access_token);
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
