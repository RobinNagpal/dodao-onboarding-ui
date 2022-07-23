<script setup lang="ts">
import { TempGuideModelInput } from '@/composables/course/EmptyGuideCourse';
import { GuideModel } from '@dodao/onboarding-schemas/models/GuideModel';
import { PropType, toRefs } from 'vue';
import UiModal from '@/components/Ui/Modal.vue';
import UiButton from '@/components/Ui/Button.vue';

const props = defineProps({
  guideInput: { type: Object as PropType<TempGuideModelInput>, required: true },
  guides: { type: Array as PropType<GuideModel[]>, required: true },
  open: { type: Boolean, required: true }
});

const emit = defineEmits(['close', 'selectGuide']);

const { open } = toRefs(props);

const selectGuide = (guideInputUuid: string, guide: GuideModel) => {
  emit('selectGuide', guideInputUuid, guide);
  emit('close');
};
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template v-slot:header>
      <h3>{{ $t('guideBundle.modal.selectGuide') }}</h3>
    </template>

    <div>
      <div class="m-4 space-y-2">
        <template v-for="guide in guides" :key="guide.uuid">
          <UiButton
            class="button-outline w-full flex justify-center items-center"
            @click="selectGuide(guideInput.uuid, guide)"
          >
            {{ guide.name }}
          </UiButton>
        </template>
      </div>
    </div>
  </UiModal>
</template>
