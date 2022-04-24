<script setup lang="ts">
import UiButton from '@/components/Ui/Button.vue';
import UiModal from '@/components/Ui/Modal.vue';
import { GuideTypesArray } from '@dodao/onboarding-schemas/models/GuideModel';
import { toRefs } from 'vue';

const props = defineProps({
  selectedType: { type: String, required: true },
  open: { type: Boolean, required: true },
  forBundleType: Boolean
});

const emit = defineEmits(['close', 'selectGuideOrBundleType']);

const { open } = toRefs(props);

const selectGuideOrBundleType = (guideOrBundleType: string) => {
  emit('selectGuideOrBundleType', guideOrBundleType);
  emit('close');
};

const modalHeading = `${
  props.forBundleType ? 'guideBundle' : 'guide'
}.modal.selectGuideOrBundleType`;
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template v-slot:header>
      <h3>
        {{ $t(modalHeading) }}
      </h3>
    </template>

    <div>
      <div class="m-4 space-y-2">
        <template
          v-for="guideOrBundleType in GuideTypesArray"
          :key="guideOrBundleType"
        >
          <UiButton
            class="button-outline w-full flex justify-center items-center"
            @click="selectGuideOrBundleType(guideOrBundleType)"
          >
            {{ $tc('navigation.' + guideOrBundleType) }}
          </UiButton>
        </template>
      </div>
    </div>
  </UiModal>
</template>
