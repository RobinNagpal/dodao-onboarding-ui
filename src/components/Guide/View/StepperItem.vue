<script setup lang="ts">
import GuideViewQuestion from '@/components/Guide/View/Question.vue';
import GuideViewUserDiscord from '@/components/Guide/View/UserDiscord.vue';
import GuideViewUserInput from '@/components/Guide/View/UserInput.vue';
import UiButton from '@/components/Ui/Button.vue';
import { UserGuideQuestionSubmission } from '@/composables/guide/TempGuideSubmission';
import { useModal } from '@/composables/useModal';
import { useWeb3 } from '@/composables/useWeb3';
import {
  GuideModel,
  GuideQuestion,
  GuideStep,
  InputType,
  isQuestion,
  isUserDiscordConnect,
  isUserInput,
  UserDiscordConnectType,
  UserInput
} from '@dodao/onboarding-schemas/models/GuideModel';
import { GuideSubmission } from '@dodao/onboarding-schemas/models/GuideSubmissionModel';
import { marked } from 'marked';
import { computed, PropType, ref } from 'vue';
import { useRoute } from 'vue-router';
import prism from 'prismjs';

import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-toml';
import 'prismjs/components/prism-solidity';
import 'prismjs/components/prism-rust';

const renderer = new marked.Renderer();
renderer.code = function (code, lang, escaped) {
  console.log('Got code', lang);
  console.log('Got code', code);
  code = renderer.options.highlight?.(code, lang!) as string;
  if (!lang) {
    return `<pre><code>${code}</code></pre>`;
  }

  const langClass = 'language-' + lang;
  return `<pre class="${langClass}"><code class="${langClass}">${code}</code></pre>`;
};

marked.setOptions({
  renderer,
  highlight: (code, lang) => {
    console.log('prism.languages', prism.languages);
    if (prism.languages[lang]) {
      return prism.highlight(code, prism.languages[lang], lang);
    } else {
      return code;
    }
  }
});

renderer.link = function (href, title, text) {
  return '<a target="_blank" href="' + href + '" title="' + title + '">' + text + '</a>';
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
  guideSubmission: {
    type: Object as PropType<GuideSubmission>
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
const route = useRoute();
const guideType = computed(() => route.params.guideType);
const renderIncorrectQuestions = ref<boolean>(false);

const { web3Account } = useWeb3();
const { modalAccountOpen } = useModal();

const emit = defineEmits(['update:questionResponse', 'update:userInputResponse', 'update:userDiscordResponse']);

const stepItems = computed(() => props.step.stepItems);

const wrongQuestions = computed(() => {
  if (props.guideSubmission) {
    return props.guide.steps.reduce<GuideQuestion[]>((wrongQuestions: GuideQuestion[], guideStep: GuideStep) => {
      const wrongOnes: GuideQuestion[] =
        (guideStep.stepItems
          .filter(item => isQuestion(item))
          .filter(item => props.guideSubmission?.result?.wrongQuestions?.includes(item.uuid)) as GuideQuestion[]) || [];

      return [...wrongQuestions, ...wrongOnes];
    }, new Array<GuideQuestion>());
  }
  return [];
});

const stepContents = computed(() => marked.parse(props.step.content, { renderer }));

const postSubmissionContent = computed(() =>
  props.guide.postSubmissionStepContent ? marked.parse(props.guide.postSubmissionStepContent, { renderer }) : null
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
    .every(question => ((props.stepSubmission[question.uuid] as string[]) || []).length > 0);

  const allRequiredFieldsAnswered = props.step.stepItems
    .filter(isUserInput)
    .filter(input => (input as UserInput).required)
    .every(userInput => !!(props.stepSubmission[userInput.uuid] as string)?.trim());

  return allQuestionsAnswered && allRequiredFieldsAnswered;
}

function isDiscordConnected(): boolean {
  const hasDiscordConnect = props.step.stepItems.find(isUserDiscordConnect);
  if (!hasDiscordConnect) return true;
  return !!props.stepSubmission[hasDiscordConnect.uuid];
}

const showQuestionsCompletionWarning = computed<boolean>(() => {
  return nextButtonClicked.value && (!isEveryQuestionAnswered() || !isDiscordConnected());
});

const isNotFirstStep = computed(() => props.step.order !== 0);

const isLastStep = computed(() => props.guide.steps.length - 2 === props.step.order);

const isPostSubmissionStep = computed(() => props.guide.steps.length - 1 === props.step.order);

const isGuideCompletedStep = computed(() => props.guide.steps.length - 1 === props.step.order);

async function navigateToNextStep() {
  nextButtonClicked.value = true;

  if (isEveryQuestionAnswered() && isDiscordConnected()) {
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
      <div class="mb-4 font-bold">{{ step.name }}</div>
      <div v-html="stepContents" class="step-content markdown-body" />
      <div v-if="isPostSubmissionStep" v-html="postSubmissionContent" class="step-content markdown-body pt-6" />

      <div
        v-if="guide.guideIntegrations?.projectGalaxyOatMintUrl && guideSubmission?.galaxyCredentialsUpdated"
        class="mt-4 mb-6 bold"
      >
        <h3 class="badge-heading">You have WON a Badge</h3>
        Claim you guide completion badge
        <a :href="guide.guideIntegrations?.projectGalaxyOatMintUrl" class="badge-claim-link">here</a>
      </div>

      <div
        v-if="
          isPostSubmissionStep &&
          guide.showIncorrectOnCompletion &&
          guideSubmission?.result?.allQuestions.length > 0 &&
          guideSubmission?.result?.correctQuestions.length < guideSubmission?.result?.allQuestions.length
        "
        class="flex align-center justify-center mt-4"
      >
        <UiButton
          :aria-label="$t('next')"
          class="w-[300px]"
          :primary="true"
          variant="contained"
          @click="renderIncorrectQuestions = !renderIncorrectQuestions"
          :loading="guideSubmitting"
          :disabled="guideSubmitting"
        >
          <span
            class="sm:block"
            v-text="$t(renderIncorrectQuestions ? 'guide.hideQuestions' : 'guide.showIncorrectChoices')"
          />
        </UiButton>
      </div>
      <div v-if="isPostSubmissionStep && renderIncorrectQuestions" class="mt-4 border-2 rounded-lg border-red p-4">
        <h3 class="mb-2">{{ $t('guide.correctAnswers') }}</h3>
        <template v-for="wrongQuestion in wrongQuestions" :key="wrongQuestion.uuid">
          <div class="mb-6">
            <GuideViewQuestion
              :answer-class="'correct-answer'"
              :question="wrongQuestion"
              :selectAnswer="() => {}"
              :questionResponse="wrongQuestion.answerKeys"
            />
          </div>
        </template>
      </div>

      <template v-for="stepItem in stepItems" :key="stepItem.uuid">
        <div class="mb-6">
          <GuideViewUserInput
            v-if="stepItem.type === InputType.PublicShortInput || stepItem.type === InputType.PrivateShortInput"
            :model-value="stepSubmission[stepItem.uuid]"
            :userInput="stepItem"
            :setUserInput="setUserInput"
            :userInputResponse="stepSubmission[stepItem.uuid] ?? ''"
          />
          <GuideViewUserDiscord
            v-else-if="stepItem.type === UserDiscordConnectType"
            :spaceId="route.params.key"
            :guideUuid="guide.uuid"
            :stepOrder="step.order"
            :stepUuid="step.uuid"
            :userDiscord="stepItem"
            :guideType="guideType"
            :discordResponse="stepSubmission[stepItem.uuid]"
          />
          <GuideViewQuestion
            v-else
            :question="stepItem"
            :selectAnswer="selectAnswer"
            :questionResponse="stepSubmission[stepItem.uuid] ?? []"
            @update:questionResponse="selectAnswer"
          />
        </div>
      </template>
    </div>
    <div v-if="showQuestionsCompletionWarning">
      <div v-if="!isEveryQuestionAnswered()" class="float-left mb-2 !text-red">
        <i class="iconfont iconwarning"></i>
        <span class="ml-1">Answer all questions to proceed</span>
      </div>
      <div v-if="!isDiscordConnected()" class="float-left mb-2 !text-red">
        <i class="iconfont iconwarning"></i>
        <span class="ml-1">Connect Discord to proceed</span>
      </div>
    </div>
    <div class="mt-2">
      <UiButton
        :aria-label="$t('previous')"
        class="float-left w-[150px]"
        @click="goToPreviousStep(step)"
        v-if="isNotFirstStep && !isGuideCompletedStep"
      >
        <span class="mr-2 font-bold">&#8592;</span>
        <span class="sm:block" v-text="$t('guide.previous')" />
      </UiButton>
      <UiButton
        v-if="!isGuideCompletedStep"
        class="float-right w-[150px]"
        variant="contained"
        :aria-label="$t('next')"
        :primary="true"
        :loading="guideSubmitting"
        :disabled="guideSubmitting"
        @click="navigateToNextStep"
      >
        <span class="sm:block" v-text="$t(isLastStep ? 'guide.complete' : 'guide.next')" />
        <span class="ml-2 font-bold">&#8594;</span>
      </UiButton>
    </div>
  </div>
</template>
<style lang="scss">
.guide-stepper-content {
  overflow: scroll;
}
.step-content li {
  margin-bottom: 0.5rem;
}
.correct-answer {
  background-color: green !important;
  border-color: green !important;
  &:after {
    background-color: green !important;
  }
}

.step-content p {
  margin-bottom: 1rem;
}

.badge-heading {
  font-weight: 700;
}

.badge-claim-link {
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: underline;
}

.step-content iframe {
  margin: 2rem 0;
}
</style>
