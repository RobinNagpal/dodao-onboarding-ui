import { useApp } from '@/composables/useApp';
import { useClient } from '@/composables/useClient';
import { useStore } from '@/composables/useStore';
import { useWeb3 } from '@/composables/useWeb3';
import { getGuide } from '@/helpers/snapshot';
import {
  ChoiceError,
  GuideError,
  QuestionError,
  StepError,
  UserInputError
} from '@/types/error';
import {
  GuideInput,
  GuideStepInput
} from '@dodao/onboarding-schemas/inputs/GuideInput';
import {
  GuideQuestion,
  GuideType,
  InputType,
  QuestionChoice,
  QuestionType,
  UserInput
} from '@dodao/onboarding-schemas/models/GuideModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import orderBy from 'lodash/orderBy';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { emptyGuide } from './EmptyGuide';

const questionContentLimit = 1024;
const inputLabelLimit = 32;
const stepContentLimit = 14400;
const guideExceptContentLimit = 64;
const choiceContentLimit = 256;
const nameLimit = 32;

export function useEditGuide(
  uuid: string | null,
  space: SpaceModel,
  notify: any
) {
  const { send } = useClient();
  const router = useRouter();
  const route = useRoute();

  const { t } = useI18n();
  const { getExplore } = useApp();
  const { store } = useStore();
  const { web3 } = useWeb3();

  const emptyGuideModel = emptyGuide(
    web3.value.account,
    space,
    (route.params.guideType as string) || GuideType.Onboarding
  );
  const guideRef = ref<GuideInput & { id?: string }>(emptyGuideModel);
  const guideErrors = ref<GuideError>({});
  const guideLoaded = ref<boolean>(false);

  const steps = computed(() => {
    return guideRef.value.steps;
  });

  const activeStepId = ref();

  const guideCreating = ref(false);

  async function initialize() {
    if (uuid) {
      const guide = await getGuide(uuid);
      guideRef.value = {
        ...guide,
        from: web3.value.account,
        space: space.id,
        thumbnail: guide.thumbnail || undefined,
        discordWebhook: guide.discordWebhook || undefined
      };
      const minOrder = Math.min(...steps.value.map(step => step.order));
      activeStepId.value = steps.value.find(
        step => step.order === minOrder
      )?.uuid;

      guideLoaded.value = true;
    } else {
      activeStepId.value = emptyGuideModel.steps[0].uuid;
      guideLoaded.value = true;
    }
  }
  function setActiveStep(uuid) {
    activeStepId.value = uuid;
  }

  function updateStep(step) {
    guideRef.value.steps = guideRef.value.steps.map(s => {
      if (s.uuid === step.uuid) {
        return step;
      } else {
        return s;
      }
    });
  }

  function moveStepUp(stepUuid) {
    const stepIndex = guideRef.value.steps.findIndex(s => s.uuid === stepUuid);
    guideRef.value.steps[stepIndex - 1].order = stepIndex;
    guideRef.value.steps[stepIndex].order = stepIndex - 1;

    guideRef.value.steps = orderBy(guideRef.value.steps, 'order');
  }

  function moveStepDown(stepUuid) {
    const stepIndex = guideRef.value.steps.findIndex(s => s.uuid === stepUuid);
    guideRef.value.steps[stepIndex + 1].order = stepIndex;
    guideRef.value.steps[stepIndex].order = stepIndex + 1;

    guideRef.value.steps = orderBy(guideRef.value.steps, 'order');
  }

  function removeStep(stepUuid) {
    if (activeStepId.value === stepUuid) {
      const stepIndex = steps.value.findIndex(step => step.uuid === stepUuid);
      if (stepIndex === steps.value.length - 1) {
        activeStepId.value = steps.value[stepIndex - 1].uuid;
      } else {
        activeStepId.value = steps.value[stepIndex + 1].uuid;
      }
    }
    guideRef.value.steps = guideRef.value.steps.filter(
      s => s.uuid !== stepUuid
    );

    guideRef.value.steps = guideRef.value.steps.map((step, index) => ({
      ...step,
      order: index
    }));
  }

  function addStep() {
    guideRef.value.steps = [
      ...guideRef.value.steps,
      {
        uuid: uuidv4(),
        name: `Step ${guideRef.value.steps.length + 1}`,
        content: '',
        stepItems: [],
        order: guideRef.value.steps.length
      }
    ];
  }

  function validateGuide(guide: GuideInput) {
    guideErrors.value.name = undefined;
    if (!guide.name || guide.name.length > nameLimit) {
      guideErrors.value.name = true;
    }
    guideErrors.value.content = undefined;
    if (!guide.content || guide.content?.length > guideExceptContentLimit) {
      guideErrors.value.content = true;
    }
    guideErrors.value.steps = undefined;
    guide.steps.forEach((step: GuideStepInput) => {
      const stepError: StepError = {};
      if (!step.name || step.name.length > nameLimit) {
        stepError.name = true;
      }
      if (step.content?.length > stepContentLimit) {
        stepError.content = true;
      }
      step.stepItems.forEach((item: GuideQuestion | UserInput) => {
        if (
          item.type === QuestionType.MultipleChoice ||
          item.type === QuestionType.SingleChoice
        ) {
          validateQuestion(item as GuideQuestion, stepError);
        } else if (
          item.type === InputType.PublicShortInput ||
          item.type === InputType.PrivateShortInput
        ) {
          validateUserInput(item as UserInput, stepError);
        }
      });
      if (Object.keys(stepError).length > 0) {
        if (!guideErrors.value.steps) {
          guideErrors.value.steps = {};
        }
        guideErrors.value.steps[step.order] = stepError;
      }
    });
    return Object.values(guideErrors.value).filter(v => !!v).length === 0;
  }

  function validateQuestion(question: GuideQuestion, stepError: StepError) {
    const questionError: QuestionError = {};
    if (!question.content || question.content.length > questionContentLimit) {
      questionError.content = true;
    }
    question.choices.forEach((choice: QuestionChoice) => {
      const choiceError: ChoiceError = {};
      if (!choice.content || choice.content.length > choiceContentLimit) {
        choiceError.content = true;
      }
      if (Object.keys(choiceError).length > 0) {
        if (!questionError.choices) {
          questionError.choices = {};
        }
        questionError.choices[choice.order] = choiceError;
      }
    });

    if (question.answerKeys.length === 0) {
      questionError.answerKeys = true;
    }
    if (Object.keys(questionError).length > 0) {
      if (!stepError.stepItems) {
        stepError.stepItems = {};
      }
      stepError.stepItems[question.order] = questionError;
    } else {
      delete stepError.stepItems;
    }
  }

  function validateUserInput(userInput: UserInput, stepError: StepError) {
    console.log('userInput', userInput);
    const userInputError: UserInputError = {};
    if (!userInput.label?.trim() || userInput.label.length > inputLabelLimit) {
      userInputError.label = true;
    }

    if (Object.keys(userInputError).length > 0) {
      if (!stepError.stepItems) {
        stepError.stepItems = {};
      }
      stepError.stepItems[userInput.order] = userInputError;
    } else {
      delete stepError.stepItems;
    }
    console.log('stepError', stepError);
  }

  async function handleSubmit() {
    const valid = validateGuide(guideRef.value);
    if (!valid) {
      console.log('Guide invalid', valid, guideErrors);
      return;
    }
    guideCreating.value = true;
    const result = await send(space, 'guide', guideRef.value);
    if (result?.id) {
      await getExplore();
      store.space.guides = [];
      notify(['green', t('notify.guideCreated')]);
      await router.push({
        name: 'guide',
        params: {
          key: space.id,
          uuid: result.uuid
        }
      });
    }
    guideCreating.value = false;
  }

  return {
    activeStepId,
    addStep,
    guideCreating,
    guideLoaded,
    guideRef,
    guideErrors,
    handleSubmit,
    initialize,
    moveStepUp,
    moveStepDown,
    removeStep,
    setActiveStep,
    updateStep
  };
}
