<script setup lang="ts">
import Block from '@/components/Block.vue';
import GuideCreateStepper from '@/components/Guide/Create/Stepper.vue';
import Icon from '@/components/Icon.vue';
import LayoutSingle from '@/components/Layout/Single.vue';
import ModalGuideGuideImport from '@/components/Modal/Guide/GuideImport.vue';
import ModalGuideGuideOrBundleType from '@/components/Modal/Guide/GuideOrBundleType.vue';
import ModalGuideCategory from '@/components/Modal/GuideCategory.vue';
import PageLoading from '@/components/PageLoading.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiDropdown from '@/components/Ui/Dropdown.vue';
import UiInput from '@/components/Ui/Input.vue';
import UiSidebarButton from '@/components/Ui/SidebarButton.vue';
import { useEditGuide } from '@/composables/guide/useEditGuide';
import { useClient } from '@/composables/useClient';
import { useModal } from '@/composables/useModal';
import { useSpace } from '@/composables/useSpace';
import { useWeb3 } from '@/composables/useWeb3';
import { setPageTitle } from '@/helpers/utils';
import {
  GuidePublishStatus,
  GuideType
} from '@dodao/onboarding-schemas/models/GuideModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed, inject, onMounted, PropType, ref, unref } from 'vue';
import { useRoute } from 'vue-router';
import { getSelectedGuild } from '@/helpers/discord/discordApi';

const props = defineProps({
  spaceId: String,
  space: { type: Object as PropType<SpaceModel>, required: true },
  from: String,
  uuid: String
});

const { isSuperAdmin } = useSpace(props.space);
const { web3, web3Account } = useWeb3();
const { clientLoading } = useClient();
const notify = inject('notify') as any;

const route = useRoute();

const uuid = route.params.uuid;
const guideType = computed(() => route.params.guideType);

const modalCategoryOpen = ref<boolean>(false);

const modalGuideOrBundleTypeOpen = ref<boolean>(false);

const modalGuideImportOpen = ref(false);

const {
  activeStepId,
  addStep,
  guideCreating,
  guideLoaded,
  guideRef: guide,
  guideErrors,
  handleSubmit,
  initialize,
  moveStepUp,
  moveStepDown,
  removeStep,
  setActiveStep,
  updateStep
} = useEditGuide(uuid as string, props.space, notify);

const form = ref(guide);

const isValid = computed(() => {
  return !clientLoading.value && !web3.value.authLoading;
});

const { modalAccountOpen } = useModal();

function clickSubmit() {
  !web3Account.value ? (modalAccountOpen.value = true) : handleSubmit();
}

const errors = unref(guideErrors);

const uploadThumbnailLoading = ref(false);
const uploadSocialShareImageLoading = ref(false);

const categoriesString = computed(() => {
  return form.value.categories ? form.value.categories.join(', ') : '';
});

function handleSubmitAddCategories(categories) {
  guide.value.categories = categories;
}

function setThumbnailUrl(url) {
  if (typeof url === 'string') form.value.thumbnail = url;
}

function setSocialShareImageUrl(url) {
  if (typeof url === 'string') form.value.socialShareImage = url;
}

function setUploadLoadingThumbnail(s) {
  uploadThumbnailLoading.value = s;
}

function setUploadSocialShareImage(s) {
  uploadSocialShareImageLoading.value = s;
}

function inputError(field: string) {
  return errors[field];
}

function importGuide(importedGuide: any) {
  form.value = importedGuide;
  activeStepId.value = form.value.steps[0].uuid;
}
onMounted(async () => {
  setPageTitle('page.title.guide.create', { space: props.space?.name });

  await initialize();
});

const guideExists = !!guide.value?.id;

function selectGuideOrBundleType(guideType: GuideType) {
  guide.value.guideType = guideType;
}

function selectPublishStatus(status) {
  guide.value.publishStatus = status;
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
  <LayoutSingle v-bind="$attrs">
    <template #content>
      <div class="px-4 md:px-0 overflow-hidden">
        <router-link
          :to="
            guideExists
              ? {
                  name: 'guide',
                  params: {
                    guideType,
                    key: props.space.id,
                    uuid: guide.value.uuid
                  }
                }
              : { name: 'guides', params: { guideType } }
          "
          class="text-color"
        >
          <Icon name="back" size="22" class="!align-middle" />
          {{ guide.id ? guide.name : 'Back to Guides' }}
        </router-link>
        <UiSidebarButton
          v-if="isSuperAdmin"
          class="float-right ml-2"
          :aria-label="$t('toggleSkin')"
          @click="modalGuideImportOpen = true"
        >
          <svg
            style="width: 24px; height: 24px"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fill="currentColor"
              d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"
            />
          </svg>
        </UiSidebarButton>
      </div>

      <template v-if="guideLoaded">
        <Block :title="$t('guide.create.basicInfo')" :class="`mt-4`">
          <template v-slot:actions>
            <router-link
              :to="{
                name: 'advancedSetting',
                params: { key: spaceId, spaceId: spaceId }
              }"
            >
              <span title="Advanced Settings" class="float-right gear-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                >
                  <path d="M0 0h48v48h-48z" fill="none" />
                  <path
                    d="M38.86 25.95c.08-.64.14-1.29.14-1.95s-.06-1.31-.14-1.95l4.23-3.31c.38-.3.49-.84.24-1.28l-4-6.93c-.25-.43-.77-.61-1.22-.43l-4.98 2.01c-1.03-.79-2.16-1.46-3.38-1.97l-.75-5.3c-.09-.47-.5-.84-1-.84h-8c-.5 0-.91.37-.99.84l-.75 5.3c-1.22.51-2.35 1.17-3.38 1.97l-4.98-2.01c-.45-.17-.97 0-1.22.43l-4 6.93c-.25.43-.14.97.24 1.28l4.22 3.31c-.08.64-.14 1.29-.14 1.95s.06 1.31.14 1.95l-4.22 3.31c-.38.3-.49.84-.24 1.28l4 6.93c.25.43.77.61 1.22.43l4.98-2.01c1.03.79 2.16 1.46 3.38 1.97l.75 5.3c.08.47.49.84.99.84h8c.5 0 .91-.37.99-.84l.75-5.3c1.22-.51 2.35-1.17 3.38-1.97l4.98 2.01c.45.17.97 0 1.22-.43l4-6.93c.25-.43.14-.97-.24-1.28l-4.22-3.31zm-14.86 5.05c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"
                  />
                </svg>
              </span>
            </router-link>
          </template>
          <div class="mb-2">
            <UiInput
              v-model="form.name"
              :error="inputError('name')"
              maxlength="32"
            >
              <template v-slot:label>{{ $t(`guide.create.name`) }}*</template>
            </UiInput>
            <UiInput
              v-model="form.thumbnail"
              placeholder="e.g. https://example.com/guide.png"
              :error="inputError('avatar')"
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
              v-model="form.socialShareImage"
              placeholder="e.g. https://example.com/guide.png ideally 800px by 418px"
              :error="inputError('socialShareImage')"
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
              v-model="form.discordWebhook"
              placeholder="e.g. https://discord.com/api/webhooks/xxxxxxxxxx"
              :error="inputError('discordWebhook')"
            >
              <template v-slot:label>
                {{ $t('guide.discordWebhook') }}
              </template>
            </UiInput>
            <UiInput
              @click="modalCategoryOpen = true"
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
            <UiInput @click="modalGuideOrBundleTypeOpen = true">
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
              v-model="form.content"
              :error="inputError('content')"
              :placeholder="$t(`guide.create.excerpt`)"
              maxlength="64"
            >
              <template v-slot:label
                >{{ $t(`guide.create.excerpt`) }}*</template
              >
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
              :activeStepId="activeStepId"
              :guide="form"
              :guideErrors="guideErrors"
              :steps="form.steps"
              :setActiveStep="setActiveStep"
              :updateStep="updateStep"
              :addStep="addStep"
              :moveStepUp="moveStepUp"
              :moveStepDown="moveStepDown"
              :removeStep="removeStep"
            />
          </div>
        </Block>
        <div
          v-if="Object.values(guideErrors).filter(v => !!v).length"
          class="!text-red flex text-center justify-center mb-2 align-baseline"
        >
          <i class="iconfont iconwarning !text-red" data-v-abc9f7ae=""></i>
          <span class="ml-1"
            >Fix errors to proceed. Make sure you have selected a correct answer
            for each question</span
          >
        </div>
        <UiButton
          @click="clickSubmit"
          :disabled="!isValid"
          :loading="clientLoading || !guideLoaded || guideCreating"
          class="block w-full"
          variant="contained"
          primary
        >
          {{ $t('create.publish') }}
        </UiButton>
      </template>
      <PageLoading v-else />
    </template>
  </LayoutSingle>
  <teleport to="#modal">
    <ModalGuideCategory
      :open="modalCategoryOpen"
      :categories="guide.categories"
      @close="modalCategoryOpen = false"
      @add="handleSubmitAddCategories"
    />
    <ModalGuideGuideOrBundleType
      :open="modalGuideOrBundleTypeOpen"
      :selected-type="guide.guideType"
      @close="modalGuideOrBundleTypeOpen = false"
      @selectGuideOrBundleType="selectGuideOrBundleType"
    />
    <ModalGuideGuideImport
      :open="modalGuideImportOpen"
      @close="modalGuideImportOpen = false"
      :import-guide="importGuide"
    />
  </teleport>
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
