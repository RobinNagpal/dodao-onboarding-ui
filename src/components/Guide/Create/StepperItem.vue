<script setup lang="ts">
import {
  GuideInput,
  GuideStepInput
} from '@dodao/onboarding-schemas/inputs/GuideInput';
import {
  GuideQuestion,
  QuestionType
} from '@dodao/onboarding-schemas/models/GuideModel';
import { v4 as uuidv4 } from 'uuid';
import { computed, PropType } from 'vue';

const props = defineProps({
  guide: { type: Object as PropType<GuideInput>, required: true },
  step: {
    type: Object as PropType<GuideStepInput>,
    required: true
  },
  moveStepUp: Function,
  moveStepDown: Function
});

const emit = defineEmits(['update:step']);

function inputError() {
  return false;
}

function updateStepName(name) {
  emit('update:step', { ...props.step, name });
}

function updateStepContent(content) {
  emit('update:step', { ...props.step, content });
}

function updateQuestionDescription(questionId, content) {
  const questions = props.step.questions.map(question => {
    if (question.uuid === questionId) {
      return {
        ...question,
        content
      };
    } else {
      return question;
    }
  });

  emit('update:step', { ...props.step, questions });
}

function updateChoiceContent(questionId, choiceKey, content) {
  const questions = props.step.questions.map(question => {
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

  emit('update:step', { ...props.step, questions });
}

const questions = computed(() => {
  return props.step.questions;
});

function newChoiceKey() {
  return uuidv4().split('-')[0];
}

function addChoice(questionId) {
  const key = newChoiceKey();
  const questions = props.step.questions.map(question => {
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

  emit('update:step', { ...props.step, questions });
}

function removeChoice(questionId, choiceKey) {
  const questions = props.step.questions.map(question => {
    if (question.uuid === questionId) {
      return {
        ...question,
        choices: question.choices.filter(choice => choice.key !== choiceKey)
      };
    } else {
      return question;
    }
  });

  emit('update:step', { ...props.step, questions });
}

function removeQuestion(questionId) {
  const filteredQuestions = props.step.questions.filter(
    question => question.uuid !== questionId
  );

  const questionsWithIndex: GuideQuestion[] = filteredQuestions.map(
    (question, index) => ({
      ...question,
      order: index
    })
  );

  emit('update:step', { ...props.step, questions: questionsWithIndex });
}

function updateAnswers(questionId, choiceKey, selected) {
  const questions = props.step.questions.map(question => {
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
  emit('update:step', { ...props.step, questions });
}

function addQuestion() {
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
    order: props.step.questions.length,
    questionType: QuestionType.MultipleChoice
  };
  const questions = [...(props.step.questions || []), question];
  emit('update:step', { ...props.step, questions });
}
</script>
<template>
  <div class="w-full border-l-2 p-4">
    <div class="h-40 mb-4" style="min-height: 40px">
      <UiSidebarButton
        class="float-right ml-2"
        :aria-label="$t('toggleSkin')"
        :disabled="step.order === 0"
        @click="moveStepUp(step.uuid)"
      >
        <Icon size="20" class="link-color" name="arrow-up" />
      </UiSidebarButton>
      <UiSidebarButton
        class="float-right ml-2"
        :aria-label="$t('toggleSkin')"
        :disabled="step.order + 1 === guide.steps.length"
        @click="moveStepDown(step.uuid)"
      >
        <Icon size="20" class="link-color" name="arrow-down" />
      </UiSidebarButton>

      <UiSidebarButton
        class="float-right ml-2"
        :aria-label="$t('toggleSkin')"
        @click="addQuestion"
      >
        <svg height="18px" viewBox="0 0 24 24" width="18px" fill="currentColor">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"
          />
        </svg>
      </UiSidebarButton>
    </div>
    <UiButtonInput
      :modelValue="step.name"
      :error="inputError('name')"
      @update:modelValue="updateStepName"
    >
      <template v-slot:label>{{ $t(`guide.step.name`) }}*</template>
    </UiButtonInput>
    <UiButton class="w-full h-96 mb-4" style="height: max-content">
      <TextareaAutosize
        :value="step.content"
        :placeholder="$t(`guide.step.contents`)"
        class="input w-full text-left"
        style="font-size: 18px"
        @update:modelValue="updateStepContent"
      />
    </UiButton>
    <template v-for="question in questions" :key="question.uuid">
      <GuideCreateQuestion
        :addChoice="addChoice"
        :question="question"
        :removeChoice="removeChoice"
        :removeQuestion="removeQuestion"
        :updateChoiceContent="updateChoiceContent"
        :updateQuestionDescription="updateQuestionDescription"
        :updateAnswers="updateAnswers"
      ></GuideCreateQuestion>
    </template>
  </div>
</template>
<style scoped lang="scss"></style>
