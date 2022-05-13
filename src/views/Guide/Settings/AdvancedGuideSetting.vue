<script setup lang="ts">
import LayoutSingle from '@/components/Layout/Single.vue';
import SettingNavigation from '@/views/Guide/Settings/SettingNavigation.vue';
import {
  getSelectedGuild,
  setSelectedRoles
} from '@/helpers/discord/discordApi';
import { setPageTitle } from '@/helpers/utils';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { onMounted, PropType, ref, computed } from 'vue';

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true },
  spaceId: String,
  spaceLoading: Boolean,
  discordCode: String,
  discordRoleIds: {
    type: Array as PropType<string[]>,
    default: () => []
  }
});

const selectedServerInfo = ref<any>(null);
const currentSelectedRoles = ref<string[]>(
  // will do
  [...props.discordRoleIds]
);

onMounted(async () => {
  setPageTitle('Advanced Guide Setting');
  try {
    selectedServerInfo.value = await getSelectedGuild(props.space.id);
  } catch (e) {
    console.log(e);
  }
});

function selectMultipleRoles(roleId: string, selected: boolean) {
  currentSelectedRoles.value = selected
    ? [...currentSelectedRoles.value, roleId]
    : currentSelectedRoles.value.filter(role => role !== roleId);
}

const paramsMap = computed(() => {
  return {
    basic: { discordRoleIds: [...currentSelectedRoles.value] }
  };
});

async function handleSubmit() {
  //call api
  await setSelectedRoles([...currentSelectedRoles.value]);
}
</script>

<template>
  <LayoutSingle v-bind="$attrs">
    <template #content>
      <div class="mb-4">
        <SettingNavigation :paramsMap="paramsMap" />
      </div>
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
    </template>
  </LayoutSingle>
</template>

<style scoped>
.discord-server-btn {
  min-width: 200px;
}
</style>
