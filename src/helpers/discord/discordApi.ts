import {
  SpaceDiscordGuild as SpaceDiscordGuildResult,
  SpaceDiscordGuildVariables
} from '@/graphql/generated/graphqlDocs';
import { SpaceDiscordGuild } from '@/graphql/space/extendedSpace.graphql';
import { useApolloClient } from '@vue/apollo-composable';

function getDiscordApiResponse(apiUrl: string, accessToken: string) {
  return fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then(res => res.json());
}

export async function getGuilds(accessToken: string): Promise<any[]> {
  const apiUrl = 'https://discord.com/api/users/@me/guilds';
  return (await getDiscordApiResponse(apiUrl, accessToken)) as any[];
}

export async function getSelectedGuild(spaceId: string): Promise<any> {
  const client = useApolloClient();
  const { data } = await client.client.query<
    SpaceDiscordGuildResult,
    SpaceDiscordGuildVariables
  >({
    query: SpaceDiscordGuild,
    variables: { spaceId }
  });
  return data.payload;
}

export async function setSelectedRoles(rolesIds: string[]): Promise<any> {
  // const client = useApolloClient();
  return Promise.resolve(true);
  // const { data } = await client.client.query<
  //   SpaceDiscordGuildResult,
  //   SpaceDiscordGuildVariables
  // >({
  //   query: SpaceDiscordGuild,
  //   variables: { spaceId }
  // });

  // return data.payload;
}
