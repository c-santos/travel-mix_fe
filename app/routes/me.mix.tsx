import { ActionFunctionArgs } from '@remix-run/node';
import { useActionData, Form } from '@remix-run/react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { getSession } from '@/session.server';
import { SpotifyPlaylistDetails } from '@constants/spotify.interfaces';
import getTopTracks from '@/apis/spotify/getTopTracks';
import getRecommendations from '@/apis/spotify/getRecommendations';
import getChartPlaylist from '@/apis/spotify/getChartPlaylist';

let destination: FormDataEntryValue | string | null = null;

async function getPlaylistTrackIds(
  playlistId: string,
  accessToken: string,
  limit: number = 3,
) {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      limit: limit,
    },
  };

  const response: AxiosResponse<SpotifyPlaylistDetails> = await axios.get(
    `${process.env.SPOTIFY_API_BASE_URL}/playlists/${playlistId}/tracks`,
    config,
  );

  console.log(response.data);

  const playlistTracklist = response.data.items;

  return playlistTracklist.map((item) => item.track.id);
}

export async function action({ request }: ActionFunctionArgs) {
  let session = await getSession(request.headers.get('cookie'));
  const token = session.get('accessToken');
  try {
    const formData = await request.formData();
    const queryString = formData.get('country');
    destination = queryString;

    const playlist = await getChartPlaylist(queryString, token!);

    console.log(playlist?.id);

    const playlistTrackIds = await getPlaylistTrackIds(playlist!.id, token!);

    const personalTracks = await getTopTracks(token!, 'short_term', 2);
    const personalTrackIds = personalTracks.map((item) => item.id);

    playlistTrackIds.push(...personalTrackIds);

    console.log(playlistTrackIds);

    const recommendedTracks = await getRecommendations(
      token!,
      playlistTrackIds,
    );

    console.log(recommendedTracks);

    return { recommendedTracks, queryString };
  } catch (error) {
    throw new Error('Could not generate recommended tracks', { cause: error });
  }
}

const MeMix = () => {
  const data = useActionData<typeof action>();

  return (
    <div>
      <Form method="post">
        <label>Search: </label>
        <input type="search" name="country" placeholder="Country/City" />
        <button type="submit">Search</button>
      </Form>
      <ul>
        {data?.recommendedTracks !== undefined
          ? data.recommendedTracks.map((item) => (
              <li key={item.id}>
                <a href={item.external_urls.spotify}>{item.name}</a>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default MeMix;
