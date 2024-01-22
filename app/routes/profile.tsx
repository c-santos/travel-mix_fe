import { LoaderFunctionArgs, createCookie, createCookieSessionStorage } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import React from 'react';

interface IToken {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: string;
  refresh_token: string;
}

async function getUserAccessToken(code: string) {
  const config: AxiosRequestConfig = {
    params: {
      auth_code: code,
    },
  };

  try {
    // Sends GET request with auth_code as parameter to backend to generate an access token
    const response = await axios.get(
      `${process.env.API_BASE_URL}/spotify-auth/callback`,
      config,
    );
    const accessToken: IToken = response.data;

    return accessToken
  } catch (error) {
    console.error(error);
    throw new Response('Could not generate access token.', {
      status: 500,
    })
  }
}

async function getAuthCodeFromUrl(request: Request) {
  const reqUrl: URL = new URL(request.url);
  const code: string | null = reqUrl.searchParams.get('code');

  if (!code) {
    throw new Response('Authorization code not present in URL.', {
      status: 500,
    });
  }

  return code;
}

async function getProfile(accessToken: string) {
  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const profileData = response.data
  return profileData;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const authCode = await getAuthCodeFromUrl(request);
  const token = await getUserAccessToken(authCode);
  const profile = await getProfile(token.access_token);

  const data = {
    name: profile.display_name,
    url: profile.external_urls.spotify,
    followers: profile.followers.total,
    country: profile.country,
    email: profile.email,
    image: profile.images[0],
  };

  return data;
}

const Profile = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.8 }}>
      <h1> Profile </h1>
      <h2>{data.name}</h2>
      <ul>
        <li>
          <a href={data.url}>Link to profile</a>
        </li>
        <li>followers: {data.followers}</li>
        <li>{data.country}</li>
        <li>{data.email}</li>
        <img
          src={data.image.url}
          height={data.image.height}
          width={data.image.width}
        />
      </ul>
    </div>
  );
};

export default Profile;
