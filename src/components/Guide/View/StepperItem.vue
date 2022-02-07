<script setup lang="ts">
import { UserGuideStepResponse } from '@/composables/useViewGuide';
import {
  GuideModel,
  GuideStep
} from '@dodao/onboarding-schemas/models/GuideModel';
import { marked } from 'marked';
import { computed, onBeforeUpdate, PropType } from 'vue';
import GuideViewQuestion from '@/components/Guide/View/Question.vue';

const props = defineProps({
  step: {
    type: Object as PropType<GuideStep>,
    required: true
  },
  goToNextStep: Function,
  goToPreviousStep: Function,
  guide: {
    type: Object as PropType<GuideModel>,
    required: true
  },
  stepResponse: {
    type: Object as PropType<UserGuideStepResponse>,
    required: true
  }
});

const emit = defineEmits(['update:questionResponse']);

const questions = computed(() => {
  return props.step.questions;
});

const stepContents = computed(() => marked.parse(props.step.content));

function selectAnswer(questionId: string, selectedAnswers: string[]) {
  console.log(questionId, selectedAnswers);

  emit('update:questionResponse', props.step.uuid, questionId, selectedAnswers);
}

onBeforeUpdate(() => {
  console.log('StepperItem - before update', props);
});
</script>
<template>
  <div class="w-full border-l-2 p-4 flex flex-col justify-between">
    <div style="min-height: 300px">
      <div class="mb-2 font-bold">{{ step.name }}</div>
      <div v-html="stepContents" class="step-content" />
      <template v-for="question in questions" :key="question.uuid">
        <GuideViewQuestion
          :question="question"
          :selectAnswer="selectAnswer"
          :questionResponse="stepResponse[question.uuid] ?? []"
          @update:questionResponse="selectAnswer"
        ></GuideViewQuestion>
      </template>
    </div>
    <div class="mt-2">
      <UiButton
        :aria-label="$t('previous')"
        class="float-left"
        @click="goToPreviousStep(step)"
        v-if="step.order !== 0"
      >
        <span class="sm:block" v-text="$t('previous')" />
        <Icon
          name="login"
          size="20"
          class="sm:hidden -ml-2 -mr-2 block align-text-bottom"
        />
      </UiButton>
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
    <div>
      <div v-if="true" class="float-right mb-2 text-sm">
        <i class="iconfont iconwarning" data-v-abc9f7ae=""></i>
        <span class="ml-1">Answer all questions to proceed</span>
      </div>
    </div>
    <div>Step response - {{ JSON.stringify(stepResponse) }}</div>
  </div>
</template>
<style lang="scss">
.step-content li {
  margin-bottom: 0.5rem;
}
.step-content p {
  margin-bottom: 1rem;
}
</style>
