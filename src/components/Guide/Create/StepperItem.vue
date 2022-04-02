<script setup lang="ts">
import UiButtonInput from '@/components/Ui/ButtonInput.vue';
import ModalGuideInputOrQuestion from '@/components/Modal/Guide/InputOrQuestion.vue';
import GuideCreateQuestion from '@/components/Guide/Create/Question.vue';
import TextareaAutosize from '@/components/TextareaAutosize.vue';
import Icon from '@/components/Icon.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiSidebarButton from '@/components/Ui/SidebarButton.vue';
import {
  GuideInput,
  GuideStepInput
} from '@dodao/onboarding-schemas/inputs/GuideInput';
import {
  GuideQuestion,
  InputType,
  QuestionType,
  UserInput
} from '@dodao/onboarding-schemas/models/GuideModel';
import { v4 as uuidv4 } from 'uuid';
import { computed, PropType, ref } from 'vue';

const props = defineProps({
  guide: { type: Object as PropType<GuideInput>, required: true },
  step: {
    type: Object as PropType<GuideStepInput>,
    required: true
  },
  stepErrors: Object,
  moveStepUp: Function,
  moveStepDown: Function
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
    order: props.step.questions.length + props.step.userInputs.length,
    questionType: type
  };
  const questions = [...(props.step.questions || []), question];
  emit('update:step', { ...props.step, questions });
}

function addInput(type: InputType) {
  const input: UserInput = {
    uuid: uuidv4(),
    label: 'Label',
    order: props.step.questions.length + props.step.userInputs.length,
    inputType: type
  };
  const inputs = [...(props.step.userInputs || []), input];
  emit('update:step', { ...props.step, userInputs: inputs });
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
        :questionErrors="stepErrors?.questions?.[question.order]"
      ></GuideCreateQuestion>
    </template>
  </div>
  <teleport to="#modal">
    <ModalGuideInputOrQuestion
      :open="modalGuideInputOrQuestionOpen"
      :categories="guide.categories"
      @close="modalGuideInputOrQuestionOpen = false"
      @addQuestion="addQuestion"
      @addInput="addInput"
    />
  </teleport>
</template>

<style scoped lang="scss"></style>
