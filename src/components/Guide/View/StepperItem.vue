<script setup lang="ts">
import GuideViewQuestion from '@/components/Guide/View/Question.vue';
import GuideViewUserInput from '@/components/Guide/View/UserInput.vue';
import UiButton from '@/components/Ui/Button.vue';
import { useModal } from '@/composables/useModal';
import { UserGuideQuestionSubmission } from '@/composables/guide/useViewGuide';
import { useWeb3 } from '@/composables/useWeb3';
import {
  GuideModel,
  GuideStep,
  InputType,
  isQuestion,
  isUserInput,
  UserInput
} from '@dodao/onboarding-schemas/models/GuideModel';
import { marked } from 'marked';
import { computed, PropType, ref } from 'vue';

const renderer = new marked.Renderer();

renderer.link = function (href, title, text) {
  return (
    '<a target="_blank" href="' +
    href +
    '" title="' +
    title +
    '">' +
    text +
    '</a>'
  );
};

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
  guideSubmitting: Boolean,
  stepSubmission: {
    type: Object as PropType<UserGuideQuestionSubmission>,
    required: true
  },
  submitGuide: {
    type: Function,
    required: true
  }
});

const { web3Account } = useWeb3();
const { modalAccountOpen } = useModal();

const emit = defineEmits([
  'update:questionResponse',
  'update:userInputResponse'
]);

const stepItems = computed(() => {
  return  props.step.stepItems;
});

const stepContents = computed(() =>
  marked.parse(props.step.content, { renderer })
);

function selectAnswer(questionId: string, selectedAnswers: string[]) {
  emit('update:questionResponse', props.step.uuid, questionId, selectedAnswers);
}

function setUserInput(userInputUuid: string, userInput: string) {
  emit('update:userInputResponse', props.step.uuid, userInputUuid, userInput);
}

const nextButtonClicked = ref<boolean>(false);

function isEveryQuestionAnswered(): boolean {
  const allQuestionsAnswered = props.step.stepItems
    .filter(isQuestion)
    .every(question => props.stepSubmission[question.uuid]?.length > 0);

  const allRequiredFieldsAnswered = props.step.stepItems
    .filter(isUserInput)
    .filter(input => (input as UserInput).required)
    .every(
      userInput => !!(props.stepSubmission[userInput.uuid] as string)?.trim()
    );

  return allQuestionsAnswered && allRequiredFieldsAnswered;
}

const showQuestionsCompletionWarning = computed<boolean>(() => {
  return nextButtonClicked.value && !isEveryQuestionAnswered();
});

const isNotFirstStep = computed(() => props.step.order !== 0);

const isLastStep = computed(
  () => props.guide.steps.length - 2 === props.step.order
);

const isGuideCompletedStep = computed(
  () => props.guide.steps.length - 1 === props.step.order
);

async function navigateToNextStep() {
  nextButtonClicked.value = true;

  if (isEveryQuestionAnswered()) {
    nextButtonClicked.value = false;
    if (isLastStep.value) {
      if (!web3Account.value) {
        modalAccountOpen.value = true;
        return;
      } else {
        await props.submitGuide();
      }
    }
    props.goToNextStep?.(props.step);
  }
}
</script>
<template>
  <div class="guide-stepper-content w-full p-4 flex flex-col justify-between">
    <div style="min-height: 300px">
      <div class="mb-2 font-bold">{{ step.name }}</div>
      <div v-html="stepContents" class="step-content markdown-body" />
      <template v-for="stepItem in stepItems" :key="stepItem.uuid">
        <GuideViewUserInput
          v-if="
            stepItem.type === InputType.PublicShortInput ||
            stepItem.type === InputType.PrivateShortInput
          "
          :userInput="stepItem"
          :setUserInput="setUserInput"
          :userInputResponse="stepSubmission[stepItem.uuid] ?? ''"
        />
        <GuideViewQuestion
          v-else
          :question="stepItem"
          :selectAnswer="selectAnswer"
          :questionResponse="stepSubmission[stepItem.uuid] ?? []"
          @update:questionResponse="selectAnswer"
        />
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
        class="float-left w-[150px]"
        @click="goToPreviousStep(step)"
        v-if="isNotFirstStep && !isGuideCompletedStep"
      >
        <span class="mr-2 font-bold ">&#8592;</span>
        <span class="sm:block" v-text="$t('guide.previous')" />
      </UiButton>
      <UiButton
        :aria-label="$t('next')"
        class="float-right w-[150px]"
        :primary="true"
        variant="contained"
        @click="navigateToNextStep"
        :loading="guideSubmitting"
        :disabled="guideSubmitting"
        v-if="!isGuideCompletedStep"
      >
        <span
          class="sm:block"
          v-text="$t(isLastStep ? 'guide.complete' : 'guide.next')"
        />
        <span class="ml-2 font-bold ">&#8594;</span>
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

.step-content iframe {
  margin: 2rem 0;
}
</style>
