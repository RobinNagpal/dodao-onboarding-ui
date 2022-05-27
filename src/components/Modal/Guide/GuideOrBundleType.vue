<script setup lang="ts">
import UiButton from '@/components/Ui/Button.vue';
import UiModal from '@/components/Ui/Modal.vue';
import { GuideTypesArray } from '@dodao/onboarding-schemas/models/GuideModel';
import { toRefs } from 'vue';

const props = defineProps({
  selectedType: { type: String, required: true },
  open: { type: Boolean, required: true }
});

const emit = defineEmits(['close', 'selectGuideType']);

const { open } = toRefs(props);

const selectGuideType = (guideType: string) => {
  emit('selectGuideType', guideType);
  emit('close');
};

const modalHeading = 'guide.modal.selectGuideOrBundleType';
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
        <template v-for="guideType in GuideTypesArray" :key="guideType">
          <UiButton class="button-outline w-full flex justify-center items-center" @click="selectGuideType(guideType)">
            {{ $tc('navigation.' + guideType) }}
          </UiButton>
        </template>
      </div>
    </div>
  </UiModal>
</template>
