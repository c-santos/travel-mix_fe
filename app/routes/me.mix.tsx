import { ActionFunctionArgs } from '@remix-run/node';
import { useActionData, Form } from '@remix-run/react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { getSession } from '@/session.server';
import { SpotifyPlaylistDetails } from '@constants/spotify.interfaces';
import getTopTracks from '@/apis/spotify/getTopTracks';
import getRecommendations from '@/apis/spotify/getRecommendations';
import getChartPlaylist from '@/apis/spotify/getChartPlaylist';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

  // console.log(response.data);

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

    const playlistTrackIds = await getPlaylistTrackIds(playlist!.id, token!, 3);

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
    <div className="p-4">
      <Form method="post" className="flex">
        <h2 className="mt-1 scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
          Where to?
        </h2>
        <Input type="search" name="country" placeholder="Country/City" />
        <Button type="submit">Search</Button>
      </Form>
      <h3>{destination?.toString()}</h3>
      <ul>
        {data?.recommendedTracks !== undefined
          ? data.recommendedTracks.map((item) => (
              <li key={item.id}>
                <a href={item.external_urls.spotify}>
                  {item.name} by {item.artists.map((artist) => artist.name)}
                </a>
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default MeMix;
