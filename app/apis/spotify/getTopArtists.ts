import axios, { AxiosRequestConfig } from 'axios';
export async function getTopArtists(accessToken: string) {
  const config: AxiosRequestConfig = {
    params: {
      limit: 5,
      time_range: 'short_term',
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/top/artists',
      config,
    );
    const topArtists = response.data.items;
    return topArtists;
  } catch (error) {
    console.error(error);
  }
}
