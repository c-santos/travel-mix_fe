import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, Form } from "@remix-run/react";
import axios, { AxiosRequestConfig } from "axios";
import React from "react"
import { getSession } from "~/session";
import { SpotifyPlaylist, SpotifyArtist } from "~/spotify.interfaces";

export async function action({ request }: ActionFunctionArgs) {
  let session = await getSession(request.headers.get('cookie'));
  const token = session.data;

  const formData = await request.formData();
  const queryString = formData.get('country');

  try {
    const config: AxiosRequestConfig = {
      params: {
        q: `Top 50 - ${queryString}`,
        type: 'playlist',
      },
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    };
    const response = await axios.get(
      `${process.env.SPOTIFY_API_BASE_URL}/search`,
      config,
    );

    const result: SpotifyPlaylist[] = response.data.playlists.items;
    // console.log(result);

    return result;
  } catch (error) {
    console.error(error);
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  return null;
}

const MeMix = () => {
  let searchResults = useActionData<SpotifyArtist[]>();
  // console.log(searchResults);

  return (
    <div>
      <Form method="post">
        <label>Search: </label>
        <input type="search" name="country" placeholder="Country/City" />
        <button type="submit">Search</button>
      </Form>
      <ul>
        {searchResults !== undefined
          ? searchResults.map((item) => (
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
