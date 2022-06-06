<script setup lang="ts">
import LayoutSingle from '@/components/Layout/Single.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { useExtendedSpaces } from '@/composables/useExtendedSpaces';
import { AddDiscordCredentials_payload, AddDiscordCredentialsVariables } from '@/graphql/generated/graphqlDocs';
import { AddDiscordCredentials } from '@/graphql/space/spaceDiscord.mutation.graphql';
import { getSelectedGuild } from '@/helpers/discord/discordApi';
import { setPageTitle } from '@/helpers/utils';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { useMutation } from '@vue/apollo-composable';
import { computed, onMounted, PropType, ref } from 'vue';
import { useRoute } from 'vue-router';

const { loadExtendedSpace } = useExtendedSpaces();
const discordClientId = import.meta.env.VITE_DISCORD_CLIENT_ID?.toString() || '';

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true },
  spaceId: String,
  spaceLoading: Boolean,
  discordCode: String
});
</script>

<template>
  <LayoutSingle v-bind="$attrs">
    <template #content>
      <h1 class="flex-1 mt-3">Configure Wallet</h1>
      <div class="wrapper py-24 flex justify-center align-center flex-col items-center">
      </div>
    </template>
  </LayoutSingle>
</template>

<style scoped lang="scss">
.wrapper {
  min-height: 200px;
}
</style>
