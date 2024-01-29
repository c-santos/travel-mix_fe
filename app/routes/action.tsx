import { ActionFunctionArgs } from '@remix-run/node';
import axios, { AxiosRequestConfig } from 'axios';
import { getSession } from '@/session.server';
import { SpotifyPlaylist } from '@constants/spotify.interfaces';

export async function action({ request }: ActionFunctionArgs) {
  let session = await getSession(request.headers.get('cookie'));
  const token = session.data;

  const formData = await request.formData();
  const queryString = formData.get('playlist');

  // console.log(queryString);
  try {
    const config: AxiosRequestConfig = {
      params: {
        q: queryString,
        type: 'playlist',
      },
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    };
    const response = await axios.get(
      `${process.env.SPOTIFY_API_BASE_URL}/search`,
      config,
    );

    const result: SpotifyPlaylist[] = response.data.playlists.items;
    // console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}
