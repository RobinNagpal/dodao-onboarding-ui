<script setup lang="ts">
import Block from '@/components/Block.vue';
import Checkbox from '@/components/Checkbox.vue';
import UiButton from '@/components/Ui/Button.vue';
import {
  EditGuideType,
  UpdateGuideFunctions
} from '@/composables/guide/useEditGuide';
import { getSelectedGuild } from '@/helpers/discord/discordApi';
import { setPageTitle } from '@/helpers/utils';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { onMounted, PropType, ref } from 'vue';

const props = defineProps({
  guide: {
    type: Object as PropType<EditGuideType>,
    required: true
  },
  space: { type: Object as PropType<SpaceModel>, required: true },
  updateGuideFunctions: {
    type: Object as PropType<UpdateGuideFunctions>,
    required: true
  }
});

const selectedServerInfo = ref<any>(null);
const currentSelectedRoles = ref<string[]>(props.guide.discordRoleIds);

onMounted(async () => {
  setPageTitle('guide.create.advancedInfo');
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

  props.updateGuideFunctions.updateGuideField(
    'discordRoleIds',
    currentSelectedRoles
  );
}
</script>

<template>
  <Block :title="$t('guide.create.advancedInfo')" :class="`mt-4`">
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
  </Block>
</template>

<style scoped>
.discord-server-btn {
  min-width: 200px;
}
</style>
