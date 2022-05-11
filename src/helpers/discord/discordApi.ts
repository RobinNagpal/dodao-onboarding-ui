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
