import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import React from "react"
import axios from "axios";
import { useLoaderData } from "@remix-run/react";
import { Image } from "@mui/icons-material";
import { Icon, IconButton } from "@mui/material";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = await axios.get('http://localhost:3001/spotify/jb')
  return json(response.data);
}

const Page = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Page</h1>
      <body>
        <img src={data.images[1].url} height={data.images[1].height} width={data.images[1].width} alt="Justin Bieber"/>
        <h1 style={{ fontFamily: 'sans-serif' }}>{data.name}</h1>
        <h2 style={{ fontFamily: 'sans-serif' }}>Genres</h2>
        {data.genres.map(item => <p key={item}>{item}</p>)}
        <a href={data.external_urls.spotify} target="_blank">Link to Spotify</a>
      </body>
    </div>
  )
};

export default Page;
