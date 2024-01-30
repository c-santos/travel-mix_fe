import { SpotifyTrack } from '@/constants/spotify.interfaces';
import axios, { AxiosRequestConfig } from 'axios';

interface TopTracksArgs {
  accessToken: string;
  range?: 'short_term' | 'medium_term' | 'long_term';
  limit?: number;
}

export default async function getTopTracks(
  accessToken: string,
  range: string = 'medium_term',
  limit: number = 5,
): Promise<SpotifyTrack[]> {
  const config: AxiosRequestConfig = {
    params: {
      limit: limit,
      time_range: range,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/top/tracks',
      config,
    );
    const topTracks: SpotifyTrack[] = response.data.items;
    return topTracks;
  } catch (error) {
    console.error(error);
    throw new Error('Could not get Top Tracks', {
      cause: error,
    });
  }
}
