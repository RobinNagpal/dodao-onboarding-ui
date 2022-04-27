<script setup lang="ts">
import Block from '@/components/Block.vue';
import GuideCreateStepper from '@/components/Guide/Create/Stepper.vue';
import Icon from '@/components/Icon.vue';
import LayoutSingle from '@/components/Layout/Single.vue';
import ModalGuideGuideImport from '@/components/Modal/Guide/GuideImport.vue';
import ModalGuideCategory from '@/components/Modal/GuideCategory.vue';
import ModalGuideGuideOrBundleType from '@/components/Modal/Guide/GuideOrBundleType.vue';
import PageLoading from '@/components/PageLoading.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiInput from '@/components/Ui/Input.vue';
import UiSidebarButton from '@/components/Ui/SidebarButton.vue';
import { useEditGuide } from '@/composables/guide/useEditGuide';
import { useClient } from '@/composables/useClient';
import { useModal } from '@/composables/useModal';
import { useSpace } from '@/composables/useSpace';
import { useWeb3 } from '@/composables/useWeb3';
import { setPageTitle } from '@/helpers/utils';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { GuideType } from '@dodao/onboarding-schemas/models/GuideModel';
import { computed, inject, onMounted, PropType, ref, unref } from 'vue';
import { useRoute } from 'vue-router';

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

const uploadLoading = ref(false);

const categoriesString = computed(() => {
  return form.value.categories ? form.value.categories.join(', ') : '';
});

function handleSubmitAddCategories(categories) {
  guide.value.categories = categories;
}

function setThumbnailUrl(url) {
  if (typeof url === 'string') form.value.thumbnail = url;
}

function setUploadLoading(s) {
  uploadLoading.value = s;
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
                  @loading="setUploadLoading"
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
            <UiInput @click="modalCategoryOpen = true">
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
          </div>
        </Block>
        <Block :title="$t('guide.create.stepByStep')" :slim="true" v-if="guide">
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
          />
        </Block>
        <div
          v-if="Object.values(guideErrors).filter(v => !!v).length"
          class="!text-red flex text-center justify-center mb-2 align-baseline"
        >
          <i class="iconfont iconwarning !text-red" data-v-abc9f7ae=""></i>
          <span class="ml-1">Fix errors to proceed</span>
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
