import { SpotifyTrack } from '@/constants/spotify.interfaces';
import axios, { AxiosRequestConfig } from 'axios';

export default async function getRecommendations(
  accessToken: string,
  seedTracks?: string[], // max of 5 tracks
  limit: number = 12,
): Promise<SpotifyTrack[]> {
  const config: AxiosRequestConfig = {
    params: {
      // seed_artists: seedArtists.join(','),
      seed_tracks: seedTracks?.join(','),
      // seed_artists: seedArtists?.join(','),
      limit: limit,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/recommendations',
      config,
    );

    const recommendedTracks = response.data.tracks;
    return recommendedTracks;
  } catch (error) {
    throw new Error('Could not get recommended tracks');
  }
}
