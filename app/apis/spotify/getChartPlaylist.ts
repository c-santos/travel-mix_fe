import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { SpotifySearchResult_Playlist } from '@constants/spotify.interfaces';

export default async function getChartPlaylist(
  queryString: FormDataEntryValue | null,
  accessToken: string,
) {
  const config: AxiosRequestConfig = {
    params: {
      q: `Top 50 - ${queryString}`,
      type: 'playlist',
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response: AxiosResponse<SpotifySearchResult_Playlist> =
      await axios.get(`${process.env.SPOTIFY_API_BASE_URL}/search`, config);

    const playlistId = response.data.playlists.items.at(0)?.id;
    const playlistName = response.data.playlists.items.at(0)?.name;
    const playlistLink =
      response.data.playlists.items.at(0)?.external_urls.spotify;

    if (!playlistId) return null;

    return {
      id: playlistId!,
      name: playlistName!,
      link: playlistLink!,
    };
  } catch (error) {
    throw new Response('Could not get Top 50 playlist', {
      status: 500,
    });
  }
}
