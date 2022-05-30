<script setup lang="ts">
import UiInput from '@/components/Ui/Input.vue';
import { UserInput } from '@dodao/onboarding-schemas/models/GuideModel';
import { PropType } from 'vue';

defineProps({
  modelValue: [String, Number],
  userInput: {
    type: Object as PropType<UserInput>,
    required: true
  },
  setUserInput: { type: Function, required: true },
  userInputResponse: { type: String, required: true }
});
</script>

<template>
  <UiInput
    :model-value="modelValue"
    maxlength="64"
    class="mt-4"
    @update:modelValue="setUserInput(userInput.uuid, $event)"
  >
    <template v-slot:label>{{ userInput.label }} {{ userInput.required ? '*' : '' }}</template>
  </UiInput>
</template>
