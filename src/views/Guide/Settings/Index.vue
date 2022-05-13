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
import { defineAsyncComponent, computed, inject, onMounted, PropType, ref, unref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  spaceId: String,
  space: { type: Object as PropType<SpaceModel>, required: true },
  from: String,
  uuid: String,
  guideType: String,
  settingTab: {
    type: String,
    default: 'basic'
  }
});


const componentsMap = {
  basic: defineAsyncComponent(() => import('../CreateGuide.vue')),
  advanced: defineAsyncComponent(() => import('./AdvancedGuideSetting.vue'))
};

const BasicOrAdvanced = computed(() => {
  const Component = componentsMap[props.settingTab || 'basic'];
  return Component;
});
</script>

<template>
  <BasicOrAdvanced v-bind="{ ...$props }"></BasicOrAdvanced>
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
