<script setup lang="ts">
import LayoutSingle from '@/components/Layout/Single.vue';
import UiButton from '@/components/Ui/Button.vue';
import { useExtendedSpaces } from '@/composables/useExtendedSpaces';
import {
  AddDiscordCredentials_payload,
  AddDiscordCredentialsVariables
} from '@/graphql/generated/graphqlDocs';

import { AddDiscordCredentials } from '@/graphql/space/spaceDiscord.mutation.graphql';
import { getSelectedGuild } from '@/helpers/discord/discordApi';
import { setPageTitle } from '@/helpers/utils';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { useMutation } from '@vue/apollo-composable';
import { computed, onMounted, PropType, ref } from 'vue';
import { useRoute } from 'vue-router';

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
    scope:
      'identify bot guilds guilds.join guilds.members.read email connections',
    client_id: discordClientId,
    response_type: 'code',
    permissions: '2048',
    state: `spaceId=${props.spaceId}&target=space`,
    redirect_uri: `${window.location.origin}/generic-discord-redirect`
  });

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
});

const { mutate: addDiscordCredentialsMutation } = useMutation<
  AddDiscordCredentials_payload,
  AddDiscordCredentialsVariables
>(AddDiscordCredentials);

const selectedServerInfo = ref<any>(null);

onMounted(async () => {
  setPageTitle('page.title.home');
  if (props.discordCode) {
    await addDiscordCredentialsMutation({
      code: props.discordCode,
      redirectUri: `${window.location.origin}/generic-discord-redirect`,
      spaceId: props.space.id
    });
  }
  await loadExtendedSpace(props.space.id);
  selectedServerInfo.value = await getSelectedGuild(props.space.id);
});
</script>

<template>
  <LayoutSingle v-bind="$attrs">
    <template #content>
      <h1 v-text="$t('setupDAO.header')" class="flex-1" />
      <div class="py-24 flex justify-center align-center flex-col items-center">
        <div class="my-6">
          <UiButton>
            <a :href="url">Connect Discord</a>
          </UiButton>
        </div>
        <div class="my-6">
          <UiButton class="discord-server-btn" v-if="selectedServerInfo">
            <img
              class="h-[24px] mr-2"
              :src="`https://cdn.discordapp.com/icons/${selectedServerInfo.id}/${selectedServerInfo.icon}.png`"
            />
            <span>{{ selectedServerInfo.name }}</span>
          </UiButton>
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
