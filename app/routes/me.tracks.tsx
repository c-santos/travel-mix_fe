import { getTrackIds } from '@/apis/spotify/getTrackIds';
import getTopTracks from '@/apis/spotify/getTopTracks';
import React from 'react';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getSession } from '@/session.server';
import getRecommendations from '@/apis/spotify/getRecommendations';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get('cookie'));
  let token = session.get('accessToken');

  // Fix parameters v
  const topTracks = await getTopTracks(token!, 'medium_term', 5);
  const seedTrackIds = getTrackIds(topTracks);
  const recommendedTracks = await getRecommendations(token!, seedTrackIds);

  return { topTracks, recommendedTracks };
}

const MeTracks: React.FC = () => {
  const { topTracks, recommendedTracks } = useLoaderData<typeof loader>();

  return (
    <div className="p-4">
      <Card className="">
        <CardHeader>
          <CardTitle>Your Top Tracks</CardTitle>
          <CardDescription>Your most played tracks.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="">
            {topTracks.map((item) => {
              return (
                <li key={item.id} className="flex p-2">
                  <Card className="flex-1 transition duration-300 hover:shadow-lg">
                    <CardHeader>
                      <img
                        src={item.album.images[2].url}
                        height={item.album.images[2].height}
                        width={item.album.images[2].width}
                        alt="album"
                      />
                      <CardTitle className="inline-block">
                        {item.name}
                      </CardTitle>
                      <CardDescription>
                        {item.artists.map((artist) => {
                          return (
                            <a
                              href={artist.external_urls.spotify}
                            >{`${artist.name} `}</a>
                          );
                        })}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Tracks</CardTitle>
          <CardDescription>
            Based on your current most played tracks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="ml-6 list-disc">
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
        </CardContent>
      </Card>

      <div>
        <Carousel
          className="ml-16 mr-16 mt-4 items-center"
          // plugins={[
          //   Autoplay({
          //     delay: 4000,
          //   }),
          // ]}
          opts={{ loop: true }}
        >
          <CarouselPrevious />
          <CarouselContent>
            {recommendedTracks.map((item) => {
              return (
                <CarouselItem
                  key={item.id}
                  className="md:basis-1/2 lg:basis-1/5"
                >
                  <div className="p-1">
                    <Card className="hover:shadow-lg transition duration-300">
                      <CardHeader className="flex aspect-square items-center p-3">
                        <img
                          src={item.album.images[1].url}
                          height={item.album.images[1].height}
                          width={item.album.images[1].width}
                        />
                        <CardTitle className="md:text-md">
                          {item.name}
                        </CardTitle>
                        <CardDescription>
                          {item.artists.map((artist) => `${artist.name} `)}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default MeTracks;
