import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { SpotifyArtist } from '@constants/spotify.interfaces';
import searchForPlaylist from '@/apis/spotify/searchForPlaylist';
import { Input } from '@/components/ui/input';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const query = formData.get('playlist');

  if (!query) throw new Error('Query string error.');

  return await searchForPlaylist(query);
}

export async function loader({ request }: LoaderFunctionArgs) {
  return null;
}

const MeSearch = () => {
  let searchResults = useActionData<SpotifyArtist[]>();
  // console.log(searchResults);

  return (
    <div>
      <Form method="post">
        <label>Search: </label>
        <Input type="search" name="playlist" placeholder="Playlist" />
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

export default MeSearch;
