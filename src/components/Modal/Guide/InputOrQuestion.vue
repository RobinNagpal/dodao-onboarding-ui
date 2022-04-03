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
      <h3>{{ $t('guide.addInputOrQuestion') }}</h3>
    </template>

    <div>
      <div class="m-4 space-y-2">
        <UiButton
          class="button-outline w-full flex justify-center items-center"
          @click="addInput(InputType.PublicShortInput)"
        >
          {{ $t('guide.publicInput') }}
        </UiButton>
        <UiButton
          class="button-outline w-full flex justify-center items-center"
          @click="addInput(InputType.PrivateShortInput)"
        >
          {{ $t('guide.privateInput') }}
        </UiButton>
        <UiButton
          class="button-outline w-full flex justify-center items-center"
          @click="addQuestion(QuestionType.MultipleChoice)"
        >
          {{ $t('guide.multipleChoiceQuestion') }}
        </UiButton>
        <UiButton
          class="button-outline w-full flex justify-center items-center"
          @click="addQuestion(QuestionType.SingleChoice)"
        >
          {{ $t('guide.singleChoiceQuestion') }}
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>
