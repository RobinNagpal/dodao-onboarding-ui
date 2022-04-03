<script setup lang="ts">
import UiInput from '@/components/Ui/Input.vue';
import { UserInput } from '@dodao/onboarding-schemas/models/GuideModel';
import { PropType } from 'vue';

defineProps({
  userInput: {
    type: Object as PropType<UserInput>,
    required: true
  },
  setUserInput: { type: Function, required: true },
  userInputResponse: { type: String, required: true }
});
</script>

<template>
  <UiInput maxlength="64" class="mt-4">
    <template v-slot:label
      >{{ userInput.label }} {{ userInput.required ? '*' : '' }}</template
    >
  </UiInput>
</template>
