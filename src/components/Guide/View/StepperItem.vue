<script setup lang="ts">
import GuideViewQuestion from '@/components/Guide/View/Question.vue';
import Icon from '@/components/Icon.vue';
import UiButton from '@/components/Ui/Button.vue';
import { UserGuideStepResponse } from '@/composables/useViewGuide';
import {
  GuideModel,
  GuideStep
} from '@dodao/onboarding-schemas/models/GuideModel';
import { marked } from 'marked';
import { computed, PropType, ref } from 'vue';

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
  emit('update:questionResponse', props.step.uuid, questionId, selectedAnswers);
}

const nextButtonClicked = ref<boolean>(false);

function isEveryQuestionAnswered(): boolean {
  return props.step.questions.every(
    question => props.stepResponse[question.uuid]?.length > 0
  );
}

function navigateToNextStep() {
  nextButtonClicked.value = true;

  if (isEveryQuestionAnswered()) {
    nextButtonClicked.value = false;
    props.goToNextStep?.(props.step);
  }
}

const showQuestionsCompletionWarning = computed<boolean>(() => {
  return nextButtonClicked.value && !isEveryQuestionAnswered();
});

const isFirstStep = computed(() => props.step.order !== 0);

const isLastStep = computed(
  () => props.guide.steps.length - 2 === props.step.order
);

const isGuideCompletedStep = computed(
  () => props.guide.steps.length - 1 === props.step.order
);
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
    <div v-if="showQuestionsCompletionWarning">
      <div class="float-left mb-2 !text-red">
        <i class="iconfont iconwarning" data-v-abc9f7ae=""></i>
        <span class="ml-1">Answer all questions to proceed</span>
      </div>
    </div>
    <div class="mt-2">
      <UiButton
        :aria-label="$t('previous')"
        class="float-left"
        @click="goToPreviousStep(step)"
        v-if="!isFirstStep && !isGuideCompletedStep"
      >
        <span class="sm:block" v-text="$t('guide.previous')" />
        <Icon
          name="login"
          size="20"
          class="sm:hidden -ml-2 -mr-2 block align-text-bottom"
        />
      </UiButton>
      <UiButton
        :aria-label="$t('next')"
        class="float-right"
        @click="navigateToNextStep"
        v-if="!isGuideCompletedStep"
      >
        <span
          class="sm:block"
          v-text="$t(isLastStep ? 'guide.complete' : 'guide.next')"
        />
        <Icon
          name="login"
          size="20"
          class="sm:hidden -ml-2 -mr-2 block align-text-bottom"
        />
      </UiButton>
    </div>
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
