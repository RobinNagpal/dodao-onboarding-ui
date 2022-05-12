<script setup lang="ts">
import LayoutSingle from '@/components/Layout/Single.vue';
import UiButton from '@/components/Ui/Button.vue';

import { AddDiscordCredentials } from '@/graphql/space/spaceDiscord.mutation.graphql';
import { getSelectedGuild, setSelectedRoles } from '@/helpers/discord/discordApi';
import { setPageTitle } from '@/helpers/utils';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { onMounted, PropType, ref } from 'vue';

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true },
  spaceId: String,
  spaceLoading: Boolean,
  discordCode: String
});

const selectedServerInfo = ref<any>(null);
const currentSelectedRoles = ref<string[]>(
  // will do
  // [...selectedServerInfo.value.selectedRoles]
  []
);

onMounted(async () => {
  setPageTitle('page.title.home');
  selectedServerInfo.value = await getSelectedGuild(props.space.id);
});

function selectMultipleRoles(roleId: string, selected: boolean) {
  currentSelectedRoles.value = selected
    ? [...currentSelectedRoles.value, roleId]
    : currentSelectedRoles.value.filter(role => role !== roleId);
}

async function handleSubmit() {
  //call api
  await setSelectedRoles([...currentSelectedRoles.value]);
}
</script>

<template>
  <LayoutSingle v-bind="$attrs">
    <template #content>
      <router-link
        :to="{
          name: 'guideCreate',
          params: { key: spaceId, spaceId: spaceId }
        }"
        class="text-color"
      >
        <Icon name="back" size="22" class="!align-middle" />
        Back
      </router-link>
      <h1 v-text="'Setup Discord Roles'" class="flex-1" />
      <div class="py-24">
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
      <div v-if="selectedServerInfo && selectedServerInfo.roles">
        <template v-for="role in selectedServerInfo.roles" :key="role.id">
          <div class="flex leading-loose items-center py-2">
            <Checkbox
              @update:modelValue="selectMultipleRoles(role.id, $event)"
              :modelValue="currentSelectedRoles.includes(role.id)"
            />
            <div class="leading-6">{{ role.name }}</div>
          </div>
        </template>
      </div>
      <div class="mt-4">
        <UiButton :primary="true" variant="contained" @click="handleSubmit()">Save</UiButton>
      </div>
    </template>
  </LayoutSingle>
</template>

<style scoped>
.discord-server-btn {
  min-width: 200px;
}
</style>
