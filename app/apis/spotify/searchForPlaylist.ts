import axios, { AxiosRequestConfig } from 'axios';
import { SpotifyPlaylist } from '@/constants/spotify.interfaces';
import { getSession } from '@/session.server';

export default async function searchForPlaylist(query: FormDataEntryValue) {
  const session = await getSession('user_session');
  const token = session.data;

  try {
    const config: AxiosRequestConfig = {
      params: {
        q: query,
        type: 'playlist',
      },
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    };

    const response = await axios.get(
      `${process.env.SPOTIFY_API_BASE_URL}/search`,
      config,
    );

    const result: SpotifyPlaylist[] = response.data.playlists.items;

    return result;
  } catch (error) {
    console.error(error);
  }
}
