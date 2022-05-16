<script setup lang="ts">
import Block from '@/components/Block.vue';
import GuideCreateStepper from '@/components/Guide/Create/Stepper.vue';
import UiDropdown from '@/components/Ui/Dropdown.vue';
import UiInput from '@/components/Ui/Input.vue';
import {
  EditGuideType,
  UpdateGuideFunctions
} from '@/composables/guide/useEditGuide';
import { GuideStepInput } from '@dodao/onboarding-schemas/inputs/GuideInput';
import { GuidePublishStatus } from '@dodao/onboarding-schemas/models/GuideModel';
import { computed, PropType, ref, unref } from 'vue';

const props = defineProps({
  activeStepId: String,
  guide: {
    type: Object as PropType<EditGuideType>,
    required: true
  },
  guideErrors: Object,
  steps: {
    type: Array as PropType<Array<GuideStepInput>>,
    required: true
  },
  errorColor: {
    type: String,
    default: '#d32f2f'
  },
  successColor: {
    type: String,
    default: '#00813a'
  },
  updateGuideFunctions: {
    type: Object as PropType<UpdateGuideFunctions>,
    required: true
  },
  updateModalCategoryOpen: {
    type: Function,
    required: true
  },
  updateModalGuideOrBundleTypeOpen: {
    type: Function,
    required: true
  }
});

const errors = unref(props.guideErrors);

function inputError(field: string) {
  return errors?.[field];
}

const uploadThumbnailLoading = ref(false);
const uploadSocialShareImageLoading = ref(false);

const categoriesString = computed(() => {
  return props.guide.categories ? props.guide.categories.join(', ') : '';
});

function setThumbnailUrl(url) {
  if (typeof url === 'string') {
    props.updateGuideFunctions.updateGuideField('thumbnail', url);
  }
}

function setSocialShareImageUrl(url) {
  if (typeof url === 'string') {
    props.updateGuideFunctions.updateGuideField('socialShareImage', url);
  }
}

function setUploadLoadingThumbnail(s) {
  uploadThumbnailLoading.value = s;
}

function setUploadSocialShareImage(s) {
  uploadSocialShareImageLoading.value = s;
}

function selectPublishStatus(status) {
  props.updateGuideFunctions.updateGuideField('publishStatus', status);
}

const guideStatuses = [
  {
    text: 'Live',
    action: GuidePublishStatus.Live
  },
  {
    text: 'Draft',
    action: GuidePublishStatus.Draft
  }
];
</script>
<template>
  <Block :title="$t('guide.create.basicInfo')" :class="`mt-4`">
    <div class="mb-2">
      <UiInput
        :model-value="guide.name"
        :error="inputError('name')"
        maxlength="32"
        @update:modelValue="
          updateGuideFunctions.updateGuideField('name', $event)
        "
      >
        <template v-slot:label>{{ $t(`guide.create.name`) }}*</template>
      </UiInput>
      <UiInput
        :model-value="guide.thumbnail"
        placeholder="e.g. https://example.com/guide.png"
        :error="inputError('avatar')"
        @update:modelValue="
          updateGuideFunctions.updateGuideField('thumbnail', $event)
        "
      >
        <template v-slot:label>
          {{ $t('guide.thumbnail') }}
        </template>
        <template v-slot:info>
          <Upload
            class="!ml-2"
            @input="setThumbnailUrl"
            @loading="setUploadLoadingThumbnail"
          >
            {{ $t('upload') }}
          </Upload>
        </template>
      </UiInput>
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
        @click="updateModalCategoryOpen(true)"
        :class="{ 'mt-6': !categoriesString }"
      >
        <template v-slot:label>
          {{ $t(`settings.categories`) }}
        </template>
        <template v-slot:selected>
          <span class="capitalize">
            {{ categoriesString }}
          </span>
        </template>
      </UiInput>
      <UiInput @click="updateModalGuideOrBundleTypeOpen(true)">
        <template v-slot:label>
          {{ $t(`guide.guideType`) }}
        </template>
        <template v-slot:selected>
          <span class="capitalize">
            {{ $tc('navigation.' + guide.guideType) }}
          </span>
        </template>
      </UiInput>
      <UiInput
        :model-value="guide.content"
        :error="inputError('content')"
        :placeholder="$t(`guide.create.excerpt`)"
        maxlength="64"
        @update:modelValue="
          updateGuideFunctions.updateGuideField('content', $event)
        "
      >
        <template v-slot:label>{{ $t(`guide.create.excerpt`) }}*</template>
      </UiInput>
      <div class="status-wrapper pt-3">
        <UiDropdown
          top="2.5rem"
          right="2.5rem"
          class="mr-2 w-[5rem] status-drop-down"
          @select="selectPublishStatus($event)"
          :items="guideStatuses"
        >
          <div class="pr-1 select-none">
            {{ guide.publishStatus === 'Live' ? 'Live' : 'Draft' }}
          </div>
        </UiDropdown>
        <div
          class="input-label text-color mr-2 whitespace-nowrap absolute forceFloat"
        >
          Publish Status*
        </div>
      </div>
    </div>
  </Block>
  <Block :title="$t('guide.create.stepByStep')" :slim="true" v-if="guide">
    <div class="mt-4">
      <GuideCreateStepper
        :active-step-id="activeStepId"
        :guide="guide"
        :guide-errors="guideErrors"
        :steps="guide.steps"
        :update-guide-functions="updateGuideFunctions"
      />
    </div>
  </Block>
  <div
    v-if="Object.values(guideErrors).filter(v => !!v).length"
    class="!text-red flex text-center justify-center mb-2 align-baseline"
  >
    <i class="iconfont iconwarning !text-red" data-v-abc9f7ae=""></i>
    <span class="ml-1"
      >Fix errors to proceed. Make sure you have selected a correct answer for
      each question</span
    >
  </div>
</template>
<style scoped lang="scss">
.gear-icon {
  svg {
    fill: var(--link-color);
    width: 24px;
    height: 24px;
  }
}
.status-wrapper {
  border-bottom: 1px solid var(--border-color);
}
.forceFloat {
  transform: translatey(-44px);
  @apply text-xs;
  transition: transform 0.1s linear, font-size 0.1s linear;
}

.status-drop-down {
  color: var(--link-color);
}
</style>
