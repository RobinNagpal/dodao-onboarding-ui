<script setup lang="ts">
import { GuideStep } from '@dodao/onboarding-schemas/models/GuideModel';
import { marked } from 'marked';
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

const stepContents = computed(() => marked.parse(props.step.content));

function selectAnswer(questionId, choiceKey, selected) {
  console.log(questionId, choiceKey, selected);
}
</script>
<template>
  <div class="w-full border-l-2 p-4 flex flex-col justify-between">
    <div>
      <div>{{ step.name }}</div>
      <div v-html="stepContents" />
      <template v-for="question in questions" :key="question.uuid">
        <GuideViewQuestion
          :question="question"
          :selectAnswer="selectAnswer"
        ></GuideViewQuestion>
      </template>
    </div>
    <UiButton
      :aria-label="$t('next')"
      class="float-right self-end"
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
