import {
  APIGuild,
  APIPartialGuild
} from 'discord-api-types/payloads/v10/guild';

function getDiscordApiResponse(apiUrl: string, accessToken: string) {
  return fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then(res => res.json());
}

export async function getGuilds(
  accessToken: string
): Promise<APIPartialGuild[]> {
  const apiUrl = 'https://discord.com/api/users/@me/guilds';
  return (await getDiscordApiResponse(
    apiUrl,
    accessToken
  )) as APIPartialGuild[];
}

export async function getGuild(
  accessToken: string,
  guildId: string
): Promise<APIGuild> {
  const apiUrl = `https://discord.com/api/guilds/${guildId}/preview`;
  return (await getDiscordApiResponse(apiUrl, accessToken)) as APIGuild;
}
