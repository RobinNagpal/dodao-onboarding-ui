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
import LoadingSpinner from '@/components/LoadingSpinner.vue';

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
const isLoaded = ref(false);

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
  selectedServerInfo.value = await getSelectedGuild(props.space.id);
  isLoaded.value = true;
  await loadExtendedSpace(props.space.id);
});
</script>

<template>
  <LayoutSingle v-bind="$attrs">
    <template #content>
      <router-link
        :to="{
          name: 'spaceEdit'
        }"
        class="white-color"
      >
        <Icon name="back" size="22" class="!align-middle" />
        Back
      </router-link>
      <h1 v-text="'Setup Discord'" class="flex-1" />
      <div
        class="wrapper py-24 flex justify-center align-center flex-col items-center"
      >
        <template v-if="isLoaded">
          <template v-if="selectedServerInfo && selectedServerInfo.id">
            <div class="mt-6 flex flex-col">
              <div
                class="text-white discord-btn inline-flex items-center justify-center button px-[24px]"
              >
                <div
                  class="h-[32px] w-[32px] overflow-hidden rounded-full mr-2"
                >
                  <img
                    v-if="selectedServerInfo && selectedServerInfo.icon"
                    class="h-full"
                    :src="`https://cdn.discordapp.com/icons/${selectedServerInfo.id}/${selectedServerInfo.icon}.png`"
                  />
                </div>
                <span>{{ selectedServerInfo.name }}</span>
              </div>
              <a class="ml-2 text-primary underline text-xs" :href="url">
                {{ $t('guide.create.changeDiscordServer') }}
              </a>
            </div>
          </template>

          <div class="my-6" v-else>
            <button
              class="text-white discord-btn inline-flex items-center justify-center button px-[24px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                enable-background="new 0 0 100 100"
                viewBox="0 0 100 100"
              >
                <path
                  fill="white"
                  d="M85.778,24.561c-11.641-8.71-22.793-8.466-22.793-8.466s-1.14,1.302-1.14,1.302c13.839,4.152,20.27,10.257,20.27,10.257   c-19.799-10.901-45.019-10.823-65.613,0c0,0,6.675-6.431,21.328-10.583c0,0-0.814-0.977-0.814-0.977s-11.071-0.244-22.793,8.466   c0,0-11.722,21.084-11.722,47.052c0,0,6.838,11.722,24.829,12.292c0,0,3.012-3.582,5.454-6.675   c-10.339-3.093-14.246-9.524-14.246-9.524c6.495,4.064,13.063,6.608,21.247,8.222c13.316,2.741,29.879-0.077,42.249-8.222   c0,0-4.07,6.594-14.734,9.606c2.442,3.012,5.373,6.512,5.373,6.512C90.662,83.254,97.5,71.532,97.5,71.613   C97.5,45.645,85.778,24.561,85.778,24.561z M34.818,64.043c-4.559,0-8.303-3.989-8.303-8.955c0.333-11.892,16.357-11.855,16.607,0   C43.121,60.054,39.458,64.043,34.818,64.043z M64.531,64.043c-4.559,0-8.303-3.989-8.303-8.955c0.366-11.869,16.19-11.874,16.607,0   C72.834,60.054,69.171,64.043,64.531,64.043z"
                />
              </svg>
              <a class="text-white ml-2" :href="url">
                {{ $t('guide.create.connectDiscord') }}
              </a>
            </button>
          </div>
        </template>
        <LoadingSpinner v-else />
      </div>
    </template>
  </LayoutSingle>
</template>

<style scoped lang="scss">
.wrapper {
  min-height: 200px;
}
.discord-btn {
  border-radius: 0.5rem;
  background-color: #5964f3;
  color: white;
  border: 1px solid;
  border-radius: 0.5rem;
  outline: none;
  padding: 8px 16px;
  font-size: 18px;
  font-weight: 500;
  svg {
    height: 36px;
  }
}
</style>
