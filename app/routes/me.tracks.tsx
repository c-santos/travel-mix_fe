import { getTrackIds } from '@/apis/spotify/getTrackIds';
import getTopTracks from '@/apis/spotify/getTopTracks';
import React from 'react';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getSession } from '@/session.server';
import { SpotifyArtist, SpotifyTrack } from '@constants/spotify.interfaces';
import getRecommendations from '@/apis/spotify/getRecommendations';

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get('cookie'));
  let token = session.get('accessToken');

  const topTracks: SpotifyTrack[] = await getTopTracks(token!, 'short_term', 5);
  const seedTrackIds = getTrackIds(topTracks);
  const recommendedTracks: SpotifyTrack[] = await getRecommendations(
    token!,
    seedTrackIds,
  );

  return { topTracks, recommendedTracks };
}

const MeTracks: React.FC = () => {
  const { topTracks, recommendedTracks } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div>
        <h3>Your Recent Top Tracks</h3>
        <ul>
          {topTracks.map((item) => {
            return (
              <li key={item.id}>
                {item.name} by {item.artists.map((artist) => `${artist.name} `)}
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3>Recommendations</h3>
        <ul>
          {recommendedTracks.map((item) => {
            return (
              <li key={item.id}>
                <a href={item.external_urls.spotify}>
                  {item.name} by{' '}
                  {item.artists.map((artist) => `${artist.name} `)}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MeTracks;
