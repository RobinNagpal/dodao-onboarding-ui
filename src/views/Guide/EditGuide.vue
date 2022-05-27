<script setup lang="ts">
import Icon from '@/components/Icon.vue';
import LayoutSingle from '@/components/Layout/Single.vue';
import ModalGuideGuideImport from '@/components/Modal/Guide/GuideImport.vue';
import ModalGuideGuideOrBundleType from '@/components/Modal/Guide/GuideOrBundleType.vue';
import ModalGuideCategory from '@/components/Modal/GuideCategory.vue';
import PageLoading from '@/components/PageLoading.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiSidebarButton from '@/components/Ui/SidebarButton.vue';
import { useEditGuide } from '@/composables/guide/useEditGuide';
import { useClient } from '@/composables/useClient';
import { useModal } from '@/composables/useModal';
import { useSpace } from '@/composables/useSpace';
import { useWeb3 } from '@/composables/useWeb3';
import { setPageTitle } from '@/helpers/utils';
import AdvancedGuideSettings from '@/views/Guide/Settings/AdvancedGuideSettings.vue';
import BasicGuideSettings from '@/views/Guide/Settings/BasicGuideSettings.vue';
import SettingNavigation from '@/views/Guide/Settings/SettingNavigation.vue';
import { GuideType } from '@dodao/onboarding-schemas/models/GuideModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed, inject, onMounted, PropType, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  spaceId: String,
  space: { type: Object as PropType<SpaceModel>, required: true },
  spaceLoading: Boolean,
  from: String,
  uuid: String,
  // this is the prop passed when the guide is getting edited
  editGuide: String,
  settingTab: {
    type: String,
    default: 'basic'
  }
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
  guideCreating,
  guideLoaded,
  guideRef: guide,
  guideErrors,
  handleSubmit,
  initialize,
  updateGuideFunctions
} = useEditGuide(uuid as string, props.space, notify, props.editGuide ? JSON.parse(props.editGuide) : undefined);

const form = ref(guide);

const isValid = computed(() => {
  return !clientLoading.value && !web3.value.authLoading;
});

const { modalAccountOpen } = useModal();

function clickSubmit() {
  !web3Account.value ? (modalAccountOpen.value = true) : handleSubmit();
}

function handleSubmitAddCategories(categories) {
  updateGuideFunctions.updateGuideField('categories', categories);
}

function updateModalCategoryOpen(value: boolean) {
  modalCategoryOpen.value = value;
}

function updateModalGuideOrBundleTypeOpen(value: boolean) {
  modalGuideOrBundleTypeOpen.value = value;
}

function importGuide(importedGuide: any) {
  form.value = importedGuide;
  activeStepId.value = form.value.steps[0].uuid;
}
onMounted(async () => {
  setPageTitle('page.title.guide.create', { space: props.space?.name });

  await initialize();
  console.log('Initialized', guide.value);
  console.log('activeStepId', activeStepId.value);
});

const guideExists = !!guide.value?.id;

function selectGuideType(guideType: GuideType) {
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
        <div class="float-right ml-2">
          <SettingNavigation :guide="guide" />
        </div>
        <UiSidebarButton
          v-if="isSuperAdmin"
          class="float-right ml-2"
          :aria-label="$t('toggleSkin')"
          @click="modalGuideImportOpen = true"
        >
          <svg style="width: 24px; height: 24px" viewBox="0 0 24 24" fill="currentColor">
            <path fill="currentColor" d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
          </svg>
        </UiSidebarButton>
      </div>

      <div v-if="guideLoaded">
        <div class="wrapper">
          <AdvancedGuideSettings
            v-if="settingTab === 'advanced' && !spaceLoading"
            :guide="form"
            :guide-errors="guideErrors"
            :update-guide-functions="updateGuideFunctions"
            :space="space"
          />

          <BasicGuideSettings
            v-if="settingTab === 'basic'"
            :active-step-id="activeStepId"
            :guide="form"
            :guide-errors="guideErrors"
            :steps="form.steps"
            :update-guide-functions="updateGuideFunctions"
            :update-modal-category-open="updateModalCategoryOpen"
            :update-modal-guide-or-bundle-type-open="updateModalGuideOrBundleTypeOpen"
          />
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
      </div>
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
      @selectGuideType="selectGuideType"
    />
    <ModalGuideGuideImport
      :open="modalGuideImportOpen"
      @close="modalGuideImportOpen = false"
      :import-guide="importGuide"
    />
  </teleport>
</template>
<style scoped lang="scss">
.wrapper {
  min-height: 484px;
}
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
