<script setup lang="ts">
import Block from '@/components/Block.vue';
import Checkbox from '@/components/Checkbox.vue';
import UiInput from '@/components/Ui/Input.vue';
import {
  EditGuideType,
  UpdateGuideFunctions
} from '@/composables/guide/useEditGuide';
import { getSelectedGuild } from '@/helpers/discord/discordApi';
import { setPageTitle } from '@/helpers/utils';
import { QuestionType } from '@dodao/onboarding-schemas/models/GuideModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed, onMounted, PropType, ref } from 'vue';

const props = defineProps({
  guide: {
    type: Object as PropType<EditGuideType>,
    required: true
  },
  guideErrors: Object,
  space: { type: Object as PropType<SpaceModel>, required: true },
  updateGuideFunctions: {
    type: Object as PropType<UpdateGuideFunctions>,
    required: true
  }
});

const selectedServerInfo = ref<any>(null);
const isLoading = ref<any>(true);

const currentSelectedRoles = ref<string[]>(props.guide.discordRoleIds);

onMounted(async () => {
  setPageTitle('guide.create.advancedInfo');
  try {
    isLoading.value = true;
    selectedServerInfo.value = await getSelectedGuild(props.space.id);
    isLoading.value = false;
  } catch (e) {
    isLoading.value = false;
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

function inputError(field: string) {
  return props.guideErrors?.[field];
}

const uploadSocialShareImageLoading = ref(false);

function setSocialShareImageUrl(url) {
  if (typeof url === 'string') {
    props.updateGuideFunctions.updateGuideField('socialShareImage', url);
  }
}

function setUploadSocialShareImage(s) {
  uploadSocialShareImageLoading.value = s;
}

const totalQuestion = computed(() => {
  const questionsNumber = props.guide.steps.reduce(
    (previousValue, currentValue) => {
      return (previousValue += currentValue.stepItems.reduce((acc, curr) => {
        if (
          curr.type === QuestionType.SingleChoice ||
          curr.type === QuestionType.MultipleChoice
        ) {
          return acc + 1;
        }
        return acc;
      }, 0));
    },
    0
  );
  return questionsNumber;
});

const handlePassingcountInput = (value: string) => {
  props.updateGuideFunctions.updateGuideField('discordRolePassingCount', value);
  if (parseInt(value) > totalQuestion.value) {
    props.updateGuideFunctions.updateGuideErrorField(
      'discordRolePassingCount',
      true
    );
  } else {
    props.updateGuideFunctions.updateGuideErrorField(
      'discordRolePassingCount',
      false
    );
  }
};
</script>

<template>
  <Block :title="$t('guide.create.advancedInfo')" :class="`mt-4 wrapper`">
    <UiInput
      :model-value="guide.socialShareImage"
      placeholder="e.g. https://example.com/guide.png ideally 800px by 418px"
      :error="inputError('socialShareImage')"
      @update:modelValue="
        updateGuideFunctions.updateGuideField('socialShareImage', $event)
      "
    >
      <template v-slot:label>
        {{ $t('guide.socialShareImage') }}
      </template>
      <template v-slot:info>
        <Upload
          class="!ml-2"
          @input="setSocialShareImageUrl"
          @loading="setUploadSocialShareImage"
        >
          {{ $t('upload') }}
        </Upload>
      </template>
    </UiInput>
    <UiInput
      :model-value="guide.discordWebhook"
      placeholder="e.g. https://discord.com/api/webhooks/xxxxxxxxxx"
      :error="inputError('discordWebhook')"
      @update:modelValue="
        updateGuideFunctions.updateGuideField('discordWebhook', $event)
      "
    >
      <template v-slot:label>
        {{ $t('guide.discordWebhook') }}
      </template>
    </UiInput>
  </Block>
  <Block :title="$t('guide.create.discordRoles')" :class="`mt-4 wrapper`">
    <div v-if="selectedServerInfo && selectedServerInfo.id">
      <div class="py-24">
        <div class="my-6">
          <div
            class="text-white discord-btn inline-flex items-center justify-center button px-[24px]"
          >
            <div class="h-[32px] w-[32px] overflow-hidden rounded-full mr-2">
              <img
                v-if="selectedServerInfo && selectedServerInfo.icon"
                class="h-full"
                :src="`https://cdn.discordapp.com/icons/${selectedServerInfo.id}/${selectedServerInfo.icon}.png`"
              />
            </div>
            <span>{{ selectedServerInfo.name }}</span>
          </div>
        </div>
      </div>
      <div v-if="selectedServerInfo && selectedServerInfo.roles?.length > 0">
        <div class="mb-3">{{ $t('guide.create.chooseDiscordRoles') }}:</div>
        <template v-for="role in selectedServerInfo.roles" :key="role.id">
          <div class="flex leading-loose items-center py-2 ml-2">
            <Checkbox
              @update:modelValue="selectMultipleRoles(role.id, $event)"
              :modelValue="currentSelectedRoles.includes(role.id)"
            />
            <div class="leading-6">{{ role.name }}</div>
          </div>
        </template>
      </div>
      <div class="w-full flex">
        <UiInput
          :model-value="guide.discordRolePassingCount"
          :error="inputError('discordRolePassingCount')"
          :number="true"
          :max="totalQuestion"
          @update:modelValue="handlePassingcountInput($event)"
        >
          <template v-slot:label>
            {{ $t(`guide.create.discordRolesPassingCount`) }}
          </template>
        </UiInput>
        <span class="text-2xl ml-2 -mt-1">/</span>
        <div class="w-[280px] pt-3">
          {{ totalQuestion }} ({{ $tc('guide.create.totalQuestionCount') }})
        </div>
      </div>
    </div>
    <div v-else>{{ $tc('guide.create.connectToDiscordForFeatures') }}</div>
  </Block>
</template>

<style scoped lang="scss">
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
}
</style>
