import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import axios, { AxiosRequestConfig } from "axios";
import React from "react"

async function handleLoginCallback(request) {
  const data = {
    authCode: request.query.code
  }
  const options: AxiosRequestConfig = {
    withCredentials: true,
  }

  try { 
    const response = await axios.post(`${process.env.API_BASE_URL}/spotify-auth/callback`, data, options);
    
    // Sends POST request to backend to generate a user

    // Response should contain cookie

  } catch (error) {
    console.error(error);
  }

  // Response should have cookie with the access token
}

export async function loader({ request }) {
  // Receive access token and store as cookie
  await handleLoginCallback(request);


}

const Profile = () => {
  // const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1> hello world </h1>
    </div>
  )
};

export default Profile;
