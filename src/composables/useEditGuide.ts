import { useApp } from '@/composables/useApp';
import { useClient } from '@/composables/useClient';
import { useStore } from '@/composables/useStore';
import { useWeb3 } from '@/composables/useWeb3';
import { getGuide } from '@/helpers/snapshot';
import {
  ChoiceError,
  GuideError,
  QuestionError,
  StepError
} from '@/types/error';
import { emptyGuide } from '@/views/Guide/EmptyGuide';
import {
  GuideInput,
  GuideStepInput
} from '@dodao/onboarding-schemas/inputs/GuideInput';
import {
  GuideQuestion,
  QuestionChoice
} from '@dodao/onboarding-schemas/models/GuideModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import orderBy from 'lodash/orderBy';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const contentLimit = 14400;
const nameLimit = 1000;

export function useEditGuide(
  uuid: string | null,
  space: SpaceModel,
  notify: any
) {
  const { send } = useClient();
  const router = useRouter();
  const { t } = useI18n();
  const { getExplore } = useApp();
  const { store } = useStore();
  const { web3 } = useWeb3();

  const emptyGuideModel = emptyGuide(web3.value.account, space);
  const guideRef = ref<GuideInput>(emptyGuideModel);
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
        space: space.id
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

  function addStep() {
    guideRef.value.steps = [
      ...guideRef.value.steps,
      {
        uuid: uuidv4(),
        name: `Step ${guideRef.value.steps.length + 1}`,
        content: '',
        order: guideRef.value.steps.length,
        questions: []
      }
    ];
  }

  function validateGuide(guide: GuideInput) {
    guideErrors.value.name = undefined;
    if (!guide.name || guide.name.length > nameLimit) {
      guideErrors.value.name = true;
    }
    guideErrors.value.content = undefined;
    if (guide.content?.length > contentLimit) {
      guideErrors.value.content = true;
    }
    guideErrors.value.steps = undefined;
    guide.steps.forEach((step: GuideStepInput) => {
      const stepError: StepError = {};
      if (!step.name || step.name.length > nameLimit) {
        stepError.name = true;
      }
      if (step.content?.length > contentLimit) {
        stepError.content = true;
      }
      step.questions.forEach((question: GuideQuestion) => {
        const questionError: QuestionError = {};
        if (!question.content || question.content.length > contentLimit) {
          questionError.content = true;
        }
        question.choices.forEach((choice: QuestionChoice) => {
          const choiceError: ChoiceError = {};
          if (!choice.content || choice.content.length > contentLimit) {
            choiceError.content = true;
          }
          if (Object.keys(choiceError).length > 0) {
            if (!questionError.choices) {
              questionError.choices = {};
            }
            questionError.choices[choice.order] = choiceError;
          }
        });
        if (Object.keys(questionError).length > 0) {
          if (!stepError.questions) {
            stepError.questions = {};
          }
          stepError.questions[question.order] = questionError;
        } else {
          delete stepError.questions;
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
    setActiveStep,
    updateStep
  };
}
