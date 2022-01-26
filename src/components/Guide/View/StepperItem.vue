<script setup lang="ts">
import { GuideStep } from '@/models/GuideModel';
import { computed, PropType } from 'vue';

const props = defineProps({
  step: {
    type: Object as PropType<GuideStep>,
    required: true
  },
  goToNextStep: Function
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
    <UiButton
      :aria-label="$t('next')"
      class="float-right"
      @click="goToNextStep(step)"
    >
      <span class="sm:block" v-text="$t('next')" />
      <Icon
        name="login"
        size="20"
        class="sm:hidden -ml-2 -mr-2 block align-text-bottom"
      />
    </UiButton>
  </div>
</template>
<style scoped lang="scss"></style>
