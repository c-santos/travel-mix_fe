import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect, redirectDocument } from "@remix-run/node";
import { Button, List, ListItem, ListItemText, TextField } from "@mui/material";
import { Form, useLoaderData } from "@remix-run/react";
import axios, { AxiosResponse } from "axios";
import { Artist } from "./artist";
import { LoaderFunctionArgs } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }:ActionFunctionArgs) {
  
  const response = await axios.get('http://localhost:3005/spotify-auth/login');
  const spotifyAuthUrl = response.data


  return redirect(spotifyAuthUrl)
}


export default function Index() {

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>

          <Form method="post" >
            <button type="submit">Log in to Spotify</button>
          </Form>
        </li>
      </ul>
    </div>
  );
}
