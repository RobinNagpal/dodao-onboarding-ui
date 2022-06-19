import { useApp } from '@/composables/useApp';
import { useClient } from '@/composables/useClient';
import { useStore } from '@/composables/useStore';
import { useWeb3 } from '@/composables/useWeb3';
import i18n from '@/helpers/i18n';
import { getGuide } from '@/helpers/snapshot';
import {
  ChoiceError,
  GuideError,
  KeyOfGuideIntegration,
  QuestionError,
  StepError,
  UserInputError
} from '@/types/error';
import { GuideInput, GuideStepInput } from '@dodao/onboarding-schemas/inputs/GuideInput';
import {
  GuideQuestion,
  GuideType,
  isQuestion,
  isUserInput,
  QuestionChoice,
  UserInput
} from '@dodao/onboarding-schemas/models/GuideModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import orderBy from 'lodash/orderBy';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { emptyGuide } from './EmptyGuide';

const questionContentLimit = 1024;
const inputLabelLimit = 32;
const stepContentLimit = 14400;
const guideExceptContentLimit = 64;
const choiceContentLimit = 256;
const nameLimit = 32;

export type EditGuideType = GuideInput & { id?: string } & {
  isPristine: boolean;
};

type KeyOfGuideInput = keyof EditGuideType;

export type UpdateGuideFunctions = {
  moveStepDown: (stepUuid) => void;
  addStep: () => void;
  updateGuideErrorField: (field: KeyOfGuideInput, value: any) => void;
  updateGuideField: (field: KeyOfGuideInput, value: any) => void;
  updateGuideIntegrationErrorField: (field: KeyOfGuideIntegration, value: any) => void;
  updateGuideIntegrationField: (field: KeyOfGuideIntegration, value: any) => void;
  updateStep: (step) => void;
  removeStep: (stepUuid) => void;
  moveStepUp: (stepUuid) => void;
  setActiveStep: (uuid) => void;
};

export function useEditGuide(uuid: string | null, space: SpaceModel, notify: any, editGuide?: EditGuideType) {
  const { send } = useClient();
  const router = useRouter();
  const route = useRoute();

  const { t } = i18n.global;
  const { getExplore } = useApp();
  const { store } = useStore();
  const { web3 } = useWeb3();

  const emptyGuideModel = emptyGuide(
    web3.value.account,
    space,
    (route.params.guideType as string) || GuideType.Onboarding
  );
  const guideRef = ref<EditGuideType>(emptyGuideModel);
  const guideErrors = ref<GuideError>({});
  const guideLoaded = ref<boolean>(false);

  const steps = computed(() => {
    return guideRef.value.steps;
  });

  const activeStepId = ref();

  const guideCreating = ref(false);

  async function initialize() {
    if (editGuide) {
      guideRef.value = editGuide;
      activeStepId.value = editGuide.steps[0].uuid;
      guideLoaded.value = true;
    } else if (uuid) {
      const guide = await getGuide(uuid);
      guideRef.value = {
        ...guide,
        isPristine: true,
        from: web3.value.account,
        postSubmissionStepContent: guide.postSubmissionStepContent || undefined,
        socialShareImage: guide.socialShareImage || undefined,
        space: space.id,
        thumbnail: guide.thumbnail || undefined,
        guideIntegrations: guide.guideIntegrations
      };
      const minOrder = Math.min(...steps.value.map(step => step.order));
      activeStepId.value = steps.value.find(step => step.order === minOrder)?.uuid;

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
    guideRef.value.steps = guideRef.value.steps.filter(s => s.uuid !== stepUuid);

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
        if (isQuestion(item)) {
          validateQuestion(item as GuideQuestion, stepError);
        } else if (isUserInput(item)) {
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
      stepError.stepItems?.[question.order] && delete stepError.stepItems[question.order];
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
    guideRef.value.isPristine = false;
    if (!valid) {
      console.log('Guide invalid', valid, guideErrors);
      return;
    }
    guideCreating.value = true;
    console.log('guideRef.value', guideRef.value);
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

  function updateGuideField(field: KeyOfGuideInput, value: any) {
    guideRef.value = {
      ...guideRef.value,
      [field]: value
    };
  }

  function updateGuideIntegrationField(field: KeyOfGuideIntegration, value: any) {
    guideRef.value = {
      ...guideRef.value,
      guideIntegrations: {
        ...guideRef.value.guideIntegrations,
        [field]: value
      }
    };
  }

  function updateGuideErrorField(field: KeyOfGuideInput, value: any) {
    guideErrors.value = {
      ...guideErrors.value,
      [field]: value
    };
  }

  function updateGuideIntegrationErrorField(field: KeyOfGuideIntegration, value: boolean | undefined) {
    let guideIntegrations: Partial<Record<KeyOfGuideIntegration, boolean | undefined>> | undefined = {
      ...guideErrors.value.guideIntegrations,
      [field]: value
    };

    if (Object.values(guideIntegrations).every(value => !value)) {
      guideIntegrations = undefined;
    }

    guideErrors.value = {
      ...guideErrors.value,
      guideIntegrations
    };
  }

  const updateGuideFunctions: UpdateGuideFunctions = {
    addStep,
    moveStepUp,
    moveStepDown,
    removeStep,
    setActiveStep,
    updateGuideErrorField,
    updateGuideField,
    updateGuideIntegrationErrorField,
    updateGuideIntegrationField,
    updateStep
  };

  return {
    activeStepId,
    guideCreating,
    guideLoaded,
    guideRef,
    guideErrors,
    updateGuideFunctions,
    handleSubmit,
    initialize
  };
}
