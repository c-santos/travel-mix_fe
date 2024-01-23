import React from 'react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import axios, { AxiosRequestConfig } from 'axios';
import { getSession } from '~/session';
import { SpotifyArtist, SpotifyTrack } from '~/spotify.interfaces';

async function getTopTracks(accessToken: string) {
  const config: AxiosRequestConfig = {
    params: {
      limit: 5,
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
    const topTracks = response.data.items;

    return topTracks;
  } catch (error) {
    console.error(error);
  }
}

async function getTopArtists(accessToken: string) {
  const config: AxiosRequestConfig = {
    params: {
      limit: 5,
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

export async function getRecommendations(
  accessToken: string,
  seedTracks: string[],
  seedArtists?: string[],
) {
  const config: AxiosRequestConfig = {
    params: {
      // seed_artists: seedArtists.join(','),
      seed_tracks: seedTracks.join(','),
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
    console.error(error);
  }
}

function getSeedArtists(topArtists: SpotifyArtist[]) {
  return topArtists.map((artist) => artist.id);
}

function getSeedTracks(topTracks: SpotifyTrack[]) {
  return topTracks.map((track) => track.id);
}

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get('cookie'));
  const token = session.data;

  const topTracks: SpotifyTrack[] = await getTopTracks(token.access_token);
  const topArtists: SpotifyArtist[] = await getTopArtists(token.access_token);

  const seedTracks = getSeedTracks(topTracks);
  const seedArtists = getSeedArtists(topArtists);

  const recommendedTracks: SpotifyTrack[] = await getRecommendations(
    token.access_token,
    seedArtists,
    seedTracks,
  );
  // console.log(recommendedTracks);

  return { topTracks, topArtists, recommendedTracks };
}


const MeTracks = () => {
  const { topTracks, topArtists, recommendedTracks } =
    useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div>
        <h3>Top Tracks</h3>
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
        <h3>Top Artists</h3>
        <ul>
          {topArtists.map((item) => {
            return <li key={item.id}>{item.name}</li>;
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
                {item.name} by {item.artists.map((artist) => `${artist.name} `)}
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
