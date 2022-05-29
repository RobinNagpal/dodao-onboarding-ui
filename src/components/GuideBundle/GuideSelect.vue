<script setup lang="ts">
import Icon from '@/components/Icon.vue';
import ModalGuideGuideSelection from '@/components/Modal/Guide/GuideSelection.vue';
import UiSidebarButton from '@/components/Ui/SidebarButton.vue';
import UiThumbnail from '@/components/Ui/Thumbnail.vue';
import { TempGuideBundleInput, TempGuideModelInput } from '@/composables/guide/EmptyGuideBundle';
import { GuideModel } from '@dodao/onboarding-schemas/models/GuideModel';
import { PropType, ref } from 'vue';
import Block from '@/components/Block.vue';
import { shorten } from '@/helpers/utils';

defineProps({
  bundleInput: {
    type: Object as PropType<TempGuideBundleInput>,
    required: true
  },
  guideErrors: { type: Boolean },
  guideInput: {
    type: Object as PropType<TempGuideModelInput>,
    required: true
  },
  guides: { type: Array as PropType<GuideModel[]>, required: true },
  moveGuideUp: { type: Function, required: true },
  moveGuideDown: { type: Function, required: true },
  removeGuideInput: { type: Function, required: true },
  selectGuide: { type: Function, required: true }
});

const modalGuideSelectionOpen = ref(false);
</script>

<template>
  <Block :slim="true" :class="`mt-4`">
    <div class="w-full border-1 p-4" :class="{ '!border-red border-2 rounded-md': guideErrors }">
      <div class="h-40 mb-4" style="min-height: 40px">
        <UiSidebarButton
          class="float-right ml-2"
          :aria-label="$t('toggleSkin')"
          :disabled="bundleInput.bundleGuides.length === 1"
          @click="removeGuideInput(guideInput.uuid)"
        >
          <Icon size="20" class="link-color" name="close" />
        </UiSidebarButton>
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
        <UiSidebarButton
          class="float-right ml-2"
          :aria-label="$t('toggleSkin')"
          @click="modalGuideSelectionOpen = true"
        >
          <svg
            v-if="guideInput.guide"
            height="24px"
            width="24px"
            fill="currentColor"
            class="bi bi-pencil-fill"
            viewBox="-4 -4 24 24"
          >
            <path
              class="ml-2"
              d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"
            />
          </svg>
          <svg v-else height="18px" viewBox="0 0 24 24" width="18px" fill="currentColor">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
            />
          </svg>
        </UiSidebarButton>
      </div>
      <div class="flex align-center" v-if="guideInput.guide">
        <UiThumbnail
          :src="guideInput.guide?.thumbnail"
          :entityId="guideInput.uuid"
          :title="guideInput.guide?.name"
          :size="'150'"
          class="mb-1"
        />
        <div class="mx-4">
          <h1
            class="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis"
            v-text="guideInput.guide?.name"
          />
          <p
            v-text="shorten(guideInput.guide?.content, 300)"
            class="break-words mb-2 text-sm h-[95px] text-ellipsis overflow-hidden text-md"
          />
        </div>
      </div>
    </div>
  </Block>
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
<style scoped lang="scss"></style>
