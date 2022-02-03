<script setup lang="ts">
import { GuideQuestion } from '@dodao/onboarding-schemas/models/GuideModel';
import { PropType } from 'vue';

defineProps({
  question: {
    type: Object as PropType<GuideQuestion>,
    required: true
  },
  selectAnswer: Function
});
</script>

<template>
  <div class="border md:rounded-lg p-4 mb-4 bg-skin-block-bg">
    <UiMarkdown :body="question.content" class="mb-6" />
    <template v-for="choice in question.choices" :key="choice.key">
      <div class="flex leading-loose">
        <Checkbox
          @update:modelValue="selectAnswer(question.uuid, choice.key, $event)"
          :modelValue="question.answerKeys.includes(choice.key)"
        />
        <div class="mt-2">{{ choice.content }}</div>
      </div>
    </template>
  </div>
</template>
