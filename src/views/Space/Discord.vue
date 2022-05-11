<script setup lang="ts">
import LayoutSingle from '@/components/Layout/Single.vue';
import UiButton from '@/components/Ui/Button.vue';
import { useExtendedSpaces } from '@/composables/useExtendedSpaces';
import {
  AddDiscordCredentials_payload,
  AddDiscordCredentialsVariables,
  SetDiscordGuildId_payload,
  SetDiscordGuildIdVariables
} from '@/graphql/generated/graphqlDocs';
import {
  AddDiscordCredentials,
  SetDiscordGuildId
} from '@/graphql/space/spaceDiscord.mutation.graphql';
import { getGuild, getGuilds } from '@/helpers/discord/discordApi';
import { setPageTitle } from '@/helpers/utils';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { useMutation } from '@vue/apollo-composable';
import { computed, onMounted, PropType, ref } from 'vue';
import { useRoute } from 'vue-router';
import UiDropdown from '@/components/Ui/Dropdown.vue';

const { loadExtendedSpace } = useExtendedSpaces();
const discordClientId =
  import.meta.env.VITE_DISCORD_CLIENT_ID?.toString() || '';

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true },
  spaceId: String,
  spaceLoading: Boolean,
  discordCode: String
});

const route = useRoute();

const url = computed(() => {
  const params = new URLSearchParams({
    scope: 'identify guilds guilds.join guilds.members.read email connections',
    client_id: discordClientId,
    response_type: 'code',
    state: `spaceId=${props.spaceId}&target=space`,
    redirect_uri: `${window.location.origin}/generic-discord-redirect`
  });

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
});

const { mutate: addDiscordCredentialsMutation } = useMutation<
  AddDiscordCredentials_payload,
  AddDiscordCredentialsVariables
>(AddDiscordCredentials);

const { mutate: setDiscordGuildIdMutation } = useMutation<
  SetDiscordGuildId_payload,
  SetDiscordGuildIdVariables
>(SetDiscordGuildId);

const discordServerOpts = ref<any[]>([]);
const selectedServer = ref<any>(null);

async function handleSelectServer(item) {
  selectedServer.value = item;
  await setDiscordGuildIdMutation({
    guildId: item.id,
    spaceId: props.space.id
  });
  await loadExtendedSpace(props.space.id);
}

onMounted(async () => {
  setPageTitle('page.title.home');
  if (props.discordCode) {
    await addDiscordCredentialsMutation({
      code: props.discordCode,
      redirectUri: `${window.location.origin}/generic-discord-redirect`,
      spaceId: props.space.id
    });
    await loadExtendedSpace(props.space.id);
  }

  const accessToken = props.space.discordAccessToken;
  if (accessToken) {
    discordServerOpts.value = await getGuilds(accessToken);
    if (props.space.discordGuidId) {
      selectedServer.value = await getGuild(
        accessToken,
        props.space.discordGuidId
      );
    }
  }
});
</script>

<template>
  <LayoutSingle v-bind="$attrs">
    <template #content>
      <h1 v-text="$t('setupDAO.header')" class="flex-1" />
      <div class="py-24 flex justify-center align-center">
        <div class="px-4 md:px-0 mb-4">
          <div v-if="space.discordAccessToken">
            {{ 'Discord Access Token: ' + space.discordAccessToken }}
          </div>
          <UiButton>
            <a :href="url">Connect Discord</a>
          </UiButton>
          <div>
            <UiDropdown
              top="2.5rem"
              right="1.5rem"
              class="inline-block mt-4"
              :items="discordServerOpts"
              @select="handleSelectServer($event)"
            >
              <UiButton class="discord-server-btn" v-if="selectedServer">
                <img
                  class="h-[24px] mr-2"
                  :src="`https://cdn.discordapp.com/icons/${selectedServer.id}/${selectedServer.icon}.png`"
                />
                <span>{{ selectedServer.name }}</span>
              </UiButton>
              <UiButton class="discord-server-btn" v-else>
                <span>Choose Discord Server</span>
              </UiButton>
              <template v-slot:item="{ item }">
                <div class="">
                  <div class="flex mr-4 items-center">
                    <img
                      class="h-[24px] mr-2"
                      :src="`https://cdn.discordapp.com/icons/${item.id}/${item.icon}.png`"
                    />
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </template>
            </UiDropdown>
          </div>
        </div>
      </div>
    </template>
  </LayoutSingle>
</template>

<style scoped>
.discord-server-btn {
  min-width: 200px;
}
</style>
