import { SpotifyTrack } from '@/constants/spotify.interfaces';

export function getTrackIds(topTracks: SpotifyTrack[]) {
  return topTracks.map((track) => track.id);
}
