<script setup lang="ts">
import GuideCreateQuestion from '@/components/Guide/Create/Question.vue';
import GuideCreateUserInput from '@/components/Guide/Create/UserInput.vue';
import GuideCreateDiscord from '@/components/Guide/Create/UserDiscord.vue';
import ModalGuideInputOrQuestion from '@/components/Modal/Guide/InputOrQuestion.vue';
import TextareaAutosize from '@/components/TextareaAutosize.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiButtonInput from '@/components/Ui/ButtonInput.vue';
import UiSidebarButton from '@/components/Ui/SidebarButton.vue';
import { StepError } from '@/types/error';
import { GuideInput, GuideStepInput } from '@dodao/onboarding-schemas/inputs/GuideInput';
import {
  DiscordType,
  GuideQuestion,
  GuideStepItem,
  InputType,
  QuestionType,
  UserInput
} from '@dodao/onboarding-schemas/models/GuideModel';
import isEqual from 'lodash/isEqual';
import { v4 as uuidv4 } from 'uuid';
import { computed, PropType, ref } from 'vue';

const props = defineProps({
  guide: { type: Object as PropType<GuideInput>, required: true },
  step: {
    type: Object as PropType<GuideStepInput>,
    required: true
  },
  stepErrors: { type: Object as PropType<StepError> },
  hasDiscord: Boolean,

  moveStepUp: Function,
  moveStepDown: Function,
  removeStep: Function
});

const emit = defineEmits(['update:step']);
const modalGuideInputOrQuestionOpen = ref(false);

function inputError(field: string) {
  return props.stepErrors?.[field];
}

function updateStepName(name) {
  emit('update:step', { ...props.step, name });
}

function updateStepContent(content) {
  emit('update:step', { ...props.step, content });
}

function updateQuestionDescription(questionId, content) {
  const stepItems = props.step.stepItems.map(question => {
    if (question.uuid === questionId) {
      return {
        ...question,
        content
      };
    } else {
      return question;
    }
  });

  emit('update:step', { ...props.step, stepItems });
}

function updateChoiceContent(questionId, choiceKey, content) {
  const stepItems = props.step.stepItems.map(question => {
    if (question.uuid === questionId) {
      const choices = question.choices.map(choice => {
        if (choice.key === choiceKey) {
          return { ...choice, content };
        } else {
          return choice;
        }
      });
      return {
        ...question,
        choices
      };
    } else {
      return question;
    }
  });

  emit('update:step', { ...props.step, stepItems });
}

const inputsAndQuestions = computed(() => {
  return [
    ...props.step.stepItems.map((q: GuideStepItem) => ({
      ...q,
      isQuestion: q.type === QuestionType.MultipleChoice || q.type === QuestionType.SingleChoice,
      isDiscord: q.type === DiscordType.DiscordButton
    }))
  ];
});

function newChoiceKey() {
  return uuidv4().split('-')[0];
}

function addChoice(questionId) {
  const key = newChoiceKey();
  const stepItems = props.step.stepItems.map(question => {
    if (question.uuid === questionId) {
      const choices = [...question.choices, { key, content: '' }];
      return {
        ...question,
        choices: choices.map((choice, index) => ({ ...choice, order: index }))
      };
    } else {
      return question;
    }
  });

  emit('update:step', { ...props.step, stepItems });
}

function removeChoice(questionId, choiceKey) {
  const stepItems = props.step.stepItems.map(question => {
    if (question.uuid === questionId) {
      return {
        ...question,
        choices: question.choices.filter(choice => choice.key !== choiceKey)
      };
    } else {
      return question;
    }
  });

  emit('update:step', { ...props.step, stepItems });
}

function removeStepItem(itemUuid) {
  const filteredQuestions = props.step.stepItems.filter(stepItem => stepItem.uuid !== itemUuid);

  const itemsWithIndex: GuideQuestion[] = filteredQuestions.map((question, index) => ({
    ...question,
    order: index
  }));

  emit('update:step', { ...props.step, stepItems: itemsWithIndex });
}

function updateUserInputLabel(itemUuid: string, label: string) {
  const stepItems = props.step.stepItems.map(userInput => {
    if (userInput.uuid === itemUuid) {
      return {
        ...userInput,
        label
      };
    } else {
      return userInput;
    }
  });

  emit('update:step', { ...props.step, stepItems });
}

function updateUserInputPrivate(itemUuid: string, isPrivate: boolean) {
  const stepItems = props.step.stepItems.map(stepItem => {
    if (stepItem.uuid === itemUuid) {
      return {
        ...stepItem,
        type: isPrivate ? InputType.PrivateShortInput : InputType.PublicShortInput
      };
    } else {
      return stepItem;
    }
  });

  emit('update:step', { ...props.step, stepItems });
}

function updateUserInputRequired(itemUuid: string, isRequired: boolean) {
  const stepItems = props.step.stepItems.map(stepItem => {
    if (stepItem.uuid === itemUuid) {
      return {
        ...stepItem,
        required: isRequired
      };
    } else {
      return stepItem;
    }
  });

  emit('update:step', { ...props.step, stepItems });
}

function updateAnswers(questionId, choiceKey, selected) {
  const stepItems = props.step.stepItems.map(question => {
    if (question.uuid === questionId) {
      const answerKeys = selected
        ? [...question.answerKeys, choiceKey]
        : question.answerKeys.filter(answer => answer !== choiceKey);
      return {
        ...question,
        answerKeys
      };
    } else {
      return question;
    }
  });
  emit('update:step', { ...props.step, stepItems });
}

function setAnswer(questionId, choiceKey) {
  const stepItems = props.step.stepItems.map(question => {
    if (question.uuid === questionId) {
      const answerKeys = isEqual(question.answerKeys, [choiceKey]) ? [] : [choiceKey];
      return {
        ...question,
        answerKeys
      };
    } else {
      return question;
    }
  });
  emit('update:step', { ...props.step, stepItems });
}

function addQuestion(type: QuestionType) {
  const question = {
    uuid: uuidv4(),
    content: '',
    choices: [
      {
        key: newChoiceKey(),
        content: '',
        order: 0
      },
      {
        key: newChoiceKey(),
        content: '',
        order: 1
      }
    ],
    answerKeys: [],
    order: props.step.stepItems.length,
    type: type
  };
  const stepItems = [...(props.step.stepItems || []), question];
  emit('update:step', { ...props.step, stepItems });
}

function addInput(type: InputType) {
  const input: UserInput = {
    uuid: uuidv4(),
    label: 'Label',
    order: props.step.stepItems.length,
    type: type,
    required: false
  };
  const inputs = [...(props.step.stepItems || []), input];
  emit('update:step', { ...props.step, stepItems: inputs });
}

function addDiscord() {
  const discord = {
    uuid: uuidv4(),
    order: props.step.stepItems.length,
    type: DiscordType.DiscordButton
  };
  const steps = [...(props.step.stepItems || []), discord];
  emit('update:step', { ...props.step, stepItems: steps });
}
</script>
<template>
  <div class="w-full p-4">
    <div class="h-40 mb-4" style="min-height: 40px">
      <h3 class="float-left">Step {{ step.order + 1 }}</h3>
      <UiSidebarButton
        class="float-right ml-2"
        :aria-label="$t('toggleSkin')"
        :disabled="guide.steps.length === 1"
        @click="removeStep(step.uuid)"
      >
        <svg
          class="text-skin-text"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9 3.25h2c.69 0 1.25.56 1.25 1.25V5h-4.5v-.5c0-.69.56-1.25 1.25-1.25ZM6.5 5v-.5A2.5 2.5 0 0 1 9 2h2a2.5 2.5 0 0 1 2.5 2.5V5h3.375a.625.625 0 1 1 0 1.25H16V15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6.25h-.875a.625.625 0 1 1 0-1.25H6.5Zm7 1.25H5.25V15c0 .966.784 1.75 1.75 1.75h6A1.75 1.75 0 0 0 14.75 15V6.25H13.5ZM8.125 8h-.25v6h1.25V8h-1Zm2.75 1V8h1.25v6h-1.25V9Z"
            fill="currentColor"
          ></path>
        </svg>
      </UiSidebarButton>
      <UiSidebarButton
        class="float-right ml-2"
        :aria-label="$t('toggleSkin')"
        :disabled="step.order === 0"
        @click="moveStepUp(step.uuid)"
      >
        <svg
          class="text-skin-text"
          width="20"
          height="20"
          viewBox="0 0 20 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.265 8.4a.375.375 0 0 0-.53 0l-4.793 4.792a.625.625 0 1 1-.884-.884l4.793-4.793a1.625 1.625 0 0 1 2.298 0l4.793 4.793a.625.625 0 1 1-.884.884l-4.793-4.793Z"
            fill="currentColor"
          ></path>
        </svg>
      </UiSidebarButton>
      <UiSidebarButton
        class="float-right ml-2"
        :aria-label="$t('toggleSkin')"
        :disabled="step.order + 1 === guide.steps.length"
        @click="moveStepDown(step.uuid)"
      >
        <svg
          class="text-skin-text"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.265 11.101a.375.375 0 0 1-.53 0L4.942 6.308a.625.625 0 1 0-.884.884l4.793 4.793a1.625 1.625 0 0 0 2.298 0l4.793-4.793a.625.625 0 1 0-.884-.884l-4.793 4.793Z"
            fill="currentColor"
          ></path>
        </svg>
      </UiSidebarButton>

      <UiSidebarButton
        class="float-right ml-2"
        :aria-label="$t('toggleSkin')"
        @click="modalGuideInputOrQuestionOpen = true"
      >
        <svg
          class="text-skin-text"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.875 10.208a.625.625 0 1 0 1.25 0v-3.75h3.75a.625.625 0 1 0 0-1.25h-3.75v-3.75a.625.625 0 1 0-1.25 0v3.75h-3.75a.625.625 0 0 0 0 1.25h3.75v3.75Z"
            fill="currentColor"
          ></path>
          <path
            d="M6.015 3.333H5c-.92 0-1.667.746-1.667 1.667v10c0 .92.746 1.666 1.667 1.666h8.333c.92 0 1.667-.746 1.667-1.666v-2.151h-1.25v2.15c0 .23-.187.417-.417.417H5A.417.417 0 0 1 4.583 15V5c0-.23.187-.417.417-.417h1.015v-1.25Z"
            fill="currentColor"
          ></path>
        </svg>
      </UiSidebarButton>
    </div>
    <UiButtonInput :modelValue="step.name" :error="inputError('name')" @update:modelValue="updateStepName">
      <template v-slot:label>{{ $t(`guide.step.name`) }}*</template>
    </UiButtonInput>
    <UiButton class="w-full h-96 mb-4" style="height: max-content">
      <TextareaAutosize
        :id="step.uuid"
        :value="step.content"
        :placeholder="$t(`guide.step.contents`)"
        class="input w-full text-left"
        style="font-size: 18px"
        @update:modelValue="updateStepContent"
      />
    </UiButton>
    <template v-for="inputOrQuestion in inputsAndQuestions" :key="inputOrQuestion.uuid">
      <GuideCreateQuestion
        v-if="inputOrQuestion.isQuestion"
        :addChoice="addChoice"
        :question="inputOrQuestion"
        :removeChoice="removeChoice"
        :removeQuestion="removeStepItem"
        :setAnswer="setAnswer"
        :updateChoiceContent="updateChoiceContent"
        :updateQuestionDescription="updateQuestionDescription"
        :updateAnswers="updateAnswers"
        :questionErrors="stepErrors?.stepItems?.[inputOrQuestion.order]"
      />
      <GuideCreateDiscord
        :userDiscord="inputOrQuestion"
        :removeDiscord="removeStepItem"
        v-else-if="inputOrQuestion.isDiscord"
      />
      <GuideCreateUserInput
        v-else
        :removeUserInput="removeStepItem"
        :userInput="inputOrQuestion"
        :userInputErrors="stepErrors?.stepItems?.[inputOrQuestion.order]"
        :updateUserInputLabel="updateUserInputLabel"
        :updateUserInputPrivate="updateUserInputPrivate"
        :updateUserInputRequired="updateUserInputRequired"
      />
    </template>
  </div>
  <teleport to="#modal">
    <ModalGuideInputOrQuestion
      :hasDiscord="hasDiscord"
      :open="modalGuideInputOrQuestionOpen"
      :categories="guide.categories"
      @close="modalGuideInputOrQuestionOpen = false"
      @addQuestion="addQuestion"
      @addInput="addInput"
      @addDiscord="addDiscord"
    />
  </teleport>
</template>

<style scoped lang="scss"></style>
