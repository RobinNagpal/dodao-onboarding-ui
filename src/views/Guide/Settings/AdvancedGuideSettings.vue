<script setup lang="ts">
import Block from '@/components/Block.vue';
import Checkbox from '@/components/Checkbox.vue';
import TextareaAutosize from '@/components/TextareaAutosize.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiDropdown from '@/components/Ui/Dropdown.vue';
import UiInput from '@/components/Ui/Input.vue';
import { EditGuideType, UpdateGuideFunctions } from '@/composables/guide/useEditGuide';
import { ExtendedSpace_space } from '@/graphql/generated/graphqlDocs';
import { getSelectedGuild } from '@/helpers/discord/discordApi';
import { setPageTitle } from '@/helpers/utils';
import { KeyOfGuideIntegration } from '@/types/error';
import { QuestionType } from '@dodao/onboarding-schemas/models/GuideModel';
import { computed, onMounted, onRenderTriggered, PropType, ref } from 'vue';

const props = defineProps({
  guide: {
    type: Object as PropType<EditGuideType>,
    required: true
  },
  guideErrors: Object,
  space: { type: Object as PropType<ExtendedSpace_space>, required: true },
  updateGuideFunctions: {
    type: Object as PropType<UpdateGuideFunctions>,
    required: true
  }
});

const selectedServerInfo = ref<any>(null);
const isLoading = ref<any>(true);

const currentSelectedRoles = ref<string[]>(props.guide.guideIntegrations.discordRoleIds || []);

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

  props.updateGuideFunctions.updateGuideIntegrationField('discordRoleIds', currentSelectedRoles);
}

function inputError(field: string) {
  return props.guideErrors?.[field];
}

function inputIntegrationError(field: KeyOfGuideIntegration) {
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
  const questionsNumber = props.guide.steps.reduce((previousValue, currentValue) => {
    return (previousValue += currentValue.stepItems.reduce((acc, curr) => {
      if (curr.type === QuestionType.SingleChoice || curr.type === QuestionType.MultipleChoice) {
        return acc + 1;
      }
      return acc;
    }, 0));
  }, 0);
  return questionsNumber;
});

const handlePassingCountInput = (value: string) => {
  const count = parseInt(value);
  props.updateGuideFunctions.updateGuideIntegrationField('discordRolePassingCount', value);
  if (count > totalQuestion.value) {
    props.updateGuideFunctions.updateGuideIntegrationErrorField('discordRolePassingCount', true);
  } else {
    props.updateGuideFunctions.updateGuideIntegrationErrorField('discordRolePassingCount', false);
  }
};

const showIncorrectChoices = [
  {
    text: 'Yes',
    value: true
  },
  {
    text: 'No',
    value: false
  }
];
</script>

<template>
  <Block :title="$t('guide.create.advancedInfo')" :class="`mt-4 wrapper`">
    <UiInput
      :model-value="guide.socialShareImage"
      placeholder="e.g. https://example.com/guide.png ideally 800px by 418px"
      :error="inputError('socialShareImage')"
      @update:modelValue="updateGuideFunctions.updateGuideField('socialShareImage', $event)"
    >
      <template v-slot:label>
        {{ $t('guide.socialShareImage') }}
      </template>
      <template v-slot:info>
        <Upload class="!ml-2" @input="setSocialShareImageUrl" @loading="setUploadSocialShareImage">
          {{ $t('upload') }}
        </Upload>
      </template>
    </UiInput>

    <div class="show-incorrect-wrapper pt-3">
      <UiDropdown
        top="2.5rem"
        right="2.5rem"
        class="mr-2 w-[5rem] status-drop-down"
        @select="updateGuideFunctions.updateGuideField('showIncorrectOnCompletion', $event.value)"
        :items="showIncorrectChoices"
      >
        <div class="pr-1 select-none">
          {{ guide.showIncorrectOnCompletion ? 'Yes' : 'No' }}
        </div>
      </UiDropdown>
      <div class="input-label text-color mr-2 whitespace-nowrap absolute forceFloat">Show Incorrect Questions*</div>
    </div>

    <UiInput
      :model-value="guide.guideIntegrations.discordWebhook"
      placeholder="e.g. https://discord.com/api/webhooks/xxxxxxxxxx"
      :error="inputIntegrationError('discordWebhook')"
      @update:modelValue="updateGuideFunctions.updateGuideIntegrationField('discordWebhook', $event)"
    >
      <template v-slot:label>
        {{ $t('guide.discordWebhook') }}
      </template>
    </UiInput>
  </Block>
  <Block :title="$t('guide.postSubmissionStepContent')" :class="`mt-4 wrapper`">
    <UiButton class="w-full h-96 mb-4" style="height: max-content">
      <TextareaAutosize
        :value="guide.postSubmissionStepContent"
        :placeholder="$t(`guide.postSubmissionStepContent`)"
        class="input w-full text-left"
        style="font-size: 18px"
        @update:modelValue="updateGuideFunctions.updateGuideField('postSubmissionStepContent', $event)"
      />
    </UiButton>
  </Block>
  <Block :title="$t('guide.create.discordRoles')" :class="`mt-4 wrapper`">
    <div v-if="selectedServerInfo && selectedServerInfo.id">
      <div class="py-24">
        <div class="my-6">
          <div class="text-white discord-btn inline-flex items-center justify-center button px-[24px]">
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
          :model-value="guide.guideIntegrations.discordRolePassingCount"
          :error="inputIntegrationError('discordRolePassingCount')"
          :number="true"
          :max="totalQuestion"
          @update:modelValue="handlePassingCountInput($event)"
        >
          <template v-slot:label>
            {{ $t(`guide.create.discordRolesPassingCount`) }}
          </template>
        </UiInput>
        <span class="text-2xl ml-2 -mt-1">/</span>
        <div class="w-[280px] pt-3">{{ totalQuestion }} ({{ $tc('guide.create.totalQuestionCount') }})</div>
      </div>
    </div>
    <div v-else>{{ $tc('guide.create.connectToDiscordForFeatures') }}</div>
  </Block>
  <Block :title="$t('guide.create.projectGalaxyCredential')" :class="`mt-4 wrapper`">
    <div v-if="space.spaceIntegrations?.projectGalaxyTokenLastFour">
      <UiInput
        :model-value="guide.guideIntegrations.projectGalaxyCredentialId"
        :error="inputIntegrationError('projectGalaxyCredentialId')"
        @update:modelValue="updateGuideFunctions.updateGuideIntegrationField('projectGalaxyCredentialId', $event)"
      >
        <template v-slot:label>
          {{ $t(`guide.create.projectGalaxyCredentialId`) }}
        </template>
      </UiInput>
      <UiInput
        :model-value="guide.guideIntegrations.projectGalaxyOatMintUrl"
        :error="inputIntegrationError('projectGalaxyOatMintUrl')"
        @update:modelValue="updateGuideFunctions.updateGuideIntegrationField('projectGalaxyOatMintUrl', $event)"
      >
        <template v-slot:label>
          {{ $t(`guide.create.projectGalaxyOatMintUrl`) }}
        </template>
      </UiInput>
    </div>
    <div v-else>{{ $tc('guide.create.setProjectGalaxyCredentials') }}</div>
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

.show-incorrect-wrapper {
  border-bottom: 1px solid var(--border-color);
}

.forceFloat {
  transform: translatey(-44px);
  @apply text-xs;
  transition: transform 0.1s linear, font-size 0.1s linear;
}
</style>
