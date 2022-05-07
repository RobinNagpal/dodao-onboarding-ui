<script setup lang="ts">
import LayoutSingle from '@/components/Layout/Single.vue';
import UiButton from '@/components/Ui/Button.vue';
import { useExtendedSpaces } from '@/composables/useExtendedSpaces';
import {
  AddDiscordCredentials_payload,
  AddDiscordCredentialsVariables
} from '@/graphql/generated/graphqlDocs';
import { addDiscordCredentials } from '@/graphql/space/addDiscordCredentials.mutation.graphql';
import { setPageTitle } from '@/helpers/utils';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { useMutation } from '@vue/apollo-composable';
import { computed, onMounted, PropType, ref } from 'vue';
import { useRoute } from 'vue-router';

const { loadExtendedSpace, extentedSpaces } = useExtendedSpaces();
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

const { mutate } = useMutation<
  AddDiscordCredentials_payload,
  AddDiscordCredentialsVariables
>(addDiscordCredentials);

onMounted(async () => {
  setPageTitle('page.title.home');
  if (props.discordCode) {
    await mutate({
      code: props.discordCode,
      redirectUri: `${window.location.origin}/generic-discord-redirect`,
      spaceId: props.spaceId
    });
    await loadExtendedSpace(props.spaceId!);
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
            {{ 'Discord Access Code :' + space.discordAccessToken }}
          </div>
          <UiButton>
            <a :href="url">Connect Discord</a>
          </UiButton>
        </div>
      </div>
    </template>
  </LayoutSingle>
</template>
