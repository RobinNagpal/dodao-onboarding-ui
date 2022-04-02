<script setup lang="ts">
import {
  InputType,
  QuestionType
} from '@dodao/onboarding-schemas/models/GuideModel';
import { toRefs } from 'vue';
import UiModal from '@/components/Ui/Modal.vue';
import UiButton from '@/components/Ui/Button.vue';

const props = defineProps(['open']);

const emit = defineEmits(['close', 'addQuestion', 'addInput']);

const { open } = toRefs(props);

const addQuestion = (questionType: QuestionType) => {
  emit('addQuestion', questionType);
  emit('close');
};

const addInput = (inputType: InputType) => {
  emit('addInput', inputType);
  emit('close');
};
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template v-slot:header>
      <h3>{{ $t('topNav.browseByBlockchain') }}</h3>
    </template>

    <div>
      <div class="m-4 space-y-2">
        <UiButton
          class="button-outline w-full flex justify-center items-center"
          @click="addQuestion(QuestionType.MultipleChoice)"
        >
          Multiple Choice
        </UiButton>
        <UiButton
          class="button-outline w-full flex justify-center items-center"
          @click="addQuestion(QuestionType.SingleChoice)"
        >
          Single Choice
        </UiButton>
        <UiButton
          class="button-outline w-full flex justify-center items-center"
          @click="addInput(InputType.PublicShortInput)"
        >
          Public Input
        </UiButton>
        <UiButton
          class="button-outline w-full flex justify-center items-center"
          @click="addInput(InputType.PrivateShortInput)"
        >
          Private Input
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>
