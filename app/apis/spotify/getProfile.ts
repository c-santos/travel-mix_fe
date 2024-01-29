import axios from 'axios';
import { SpotifyProfile } from '@constants/spotify.interfaces';

export default async function getProfile(accessToken: string) {
  try {
    const response = await axios.get(`${process.env.SPOTIFY_API_BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const profileData: SpotifyProfile = response.data;

    return profileData;
  } catch (error) {
    throw new Error('Could not load Profile data.', {
      cause: error,
    });
  }
}
