import { SpotifyArtist } from '@/constants/spotify.interfaces';

export function getArtistIds(topArtists: SpotifyArtist[]) {
  return topArtists.map((artist) => artist.id);
}
