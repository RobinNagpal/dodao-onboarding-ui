<script setup lang="ts">
import { GuideStep } from '@/models/Guide';
import { computed, PropType } from 'vue';

const props = defineProps({
  step: {
    type: Object as PropType<GuideStep>,
    required: true
  }
});

const emit = defineEmits(['update:step']);

const questions = computed(() => {
  return props.step.questions;
});

function selectAnswer(questionId, choiceKey, selected) {
  console.log(questionId, choiceKey, selected);
}
</script>
<template>
  <div class="w-full border-l-2 p-4">
    <div>{{ step.name }}</div>
    <UiMarkdown :body="step.content" class="mb-6" />
    <template v-for="question in questions" :key="question.uuid">
      <GuideViewQuestion
        :question="question"
        :selectAnswer="selectAnswer"
      ></GuideViewQuestion>
    </template>
  </div>
</template>
<style scoped lang="scss"></style>
