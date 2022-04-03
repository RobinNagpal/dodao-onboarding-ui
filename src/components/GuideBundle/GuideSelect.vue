<script setup lang="ts">
import Icon from '@/components/Icon.vue';
import ModalGuideGuideSelection from '@/components/Modal/Guide/GuideSelection.vue';
import UiSidebarButton from '@/components/Ui/SidebarButton.vue';
import {
  TempGuideBundleInput,
  TempGuideModelInput
} from '@/composables/guide/EmptyGuideBundle';
import { GuideModel } from '@dodao/onboarding-schemas/models/GuideModel';
import { PropType, ref } from 'vue';

const props = defineProps({
  bundleInput: {
    type: Object as PropType<TempGuideBundleInput>,
    required: true
  },
  guide: { type: Object as PropType<GuideModel> },
  guideErrors: { type: Boolean },
  guideInput: {
    type: Object as PropType<TempGuideModelInput>,
    required: true
  },
  guides: { type: Array as PropType<GuideModel[]>, required: true },
  moveGuideUp: { type: Function, required: true },
  moveGuideDown: { type: Function, required: true },
  selectGuide: { type: Function, required: true }
});

const modalGuideSelectionOpen = ref(false);
</script>

<template>
  <div class="w-full border-l-2 p-4">
    <div class="h-40 mb-4" style="min-height: 40px">
      <UiSidebarButton
        class="float-right ml-2"
        :aria-label="$t('toggleSkin')"
        :disabled="guideInput.order === 0"
        @click="moveGuideUp(guideInput.uuid)"
      >
        <Icon size="20" class="link-color" name="arrow-up" />
      </UiSidebarButton>
      <UiSidebarButton
        class="float-right ml-2"
        :aria-label="$t('toggleSkin')"
        :disabled="guideInput.order + 1 === bundleInput.bundleGuides.length"
        @click="moveGuideDown(guideInput.uuid)"
      >
        <Icon size="20" class="link-color" name="arrow-down" />
      </UiSidebarButton>
    </div>
  </div>
  <teleport to="#modal">
    <ModalGuideGuideSelection
      :guide-input="guideInput"
      :open="modalGuideSelectionOpen"
      :guides="guides"
      @close="modalGuideSelectionOpen = false"
      @selectGuide="selectGuide"
    />
  </teleport>
</template>
