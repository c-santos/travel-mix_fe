import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import React from 'react';
import axios, { AxiosResponse } from 'axios';
import { useLoaderData, Form, Outlet } from '@remix-run/react';
import { ListItem, ListItemText, List, TextField, Button } from '@mui/material';

export interface Artist {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: string;
    width: string;
  }>;
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

let shownArtist: string = '';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get('_action');
  console.log(action);

  switch (action) {
    case 'search_artist': {
      const artistId = formData.get('artistId');
      const response = await axios.get(
        `http://localhost:3005/spotify/${artistId}`,
      );
      shownArtist = response.data.name;
      return null;
    }

    case 'login': {
      const loginResponse = await axios.get('http://localhost:3005/spotify-auth/login');
      const spotifyAuthUrl = loginResponse.data
      return redirect(spotifyAuthUrl)
    }
    
    default:
      break;
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const data = shownArtist;
  return data;
}

const ArtistPage = () => {
  const artist = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.8 }}>
      <h1>Page</h1>
      <body>
        <Form method="post">
          <label>Search Artist </label>
          <input name="artistId" />
          <button type="submit" name="_action" value={'search_artist'}>
            Submit
          </button>
        </Form>
        <h3>{artist}</h3>
        <Form method="post">
          <button type="submit" name="_action" value={'login'}>
            Login with Spotify
          </button>
        </Form>
      </body>
    </div>
  );
};

export default ArtistPage;
