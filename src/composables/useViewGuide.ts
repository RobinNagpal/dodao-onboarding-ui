import { useClient } from '@/composables/useClient';
import { useWeb3 } from '@/composables/useWeb3';
import { GuideQuery_guide_steps } from '@/graphql/generated/graphqlDocs';
import { getGuide } from '@/helpers/snapshot';
import {
  GuideQuestionResponse,
  GuideResponseInput,
  GuideStepResponse
} from '@dodao/onboarding-schemas/inputs/GuideResponseInput';
import { GuideModel } from '@dodao/onboarding-schemas/models/GuideModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export type UserGuideStepResponse = Record<string, string[]>;

export function useViewGuide(uuid: string, notify: any, space: SpaceModel) {
  const { send } = useClient();
  const { web3 } = useWeb3();
  const { t } = useI18n();

  const guideRef = ref<GuideModel>();
  const guideResponseRef = ref<Record<string, UserGuideStepResponse>>({});
  const guideLoaded = ref<boolean>(false);
  const guideSubmittingRef = ref<boolean>(false);
  const activeStepId = ref();

  async function initialize() {
    const guide = await getGuide(uuid);
    guideRef.value = {
      ...guide,
      space: guide.space as unknown as SpaceModel,
      steps: [
        ...guide.steps,
        {
          content: 'The guide has been completed successfully!',
          name: 'Completed',
          order: guide.steps.length,
          uuid: 'UUID',
          questions: []
        }
      ],
      thumbnail: guide.thumbnail || undefined
    };
    const minOrder = Math.min(...guide.steps.map(step => step.order));
    activeStepId.value = guide.steps.find(
      step => step.order === minOrder
    )?.uuid;

    guideLoaded.value = true;
  }

  function setActiveStep(uuid) {
    activeStepId.value = uuid;
  }

  function goToNextStep(currentStep: GuideQuery_guide_steps) {
    console.log('goToNextStep');
    const steps = guideRef.value?.steps || [];
    const nextStep = steps.find(step => step?.order === currentStep.order + 1);
    activeStepId.value = nextStep?.uuid;
  }

  function goToPreviousStep(currentStep: GuideQuery_guide_steps) {
    const steps = guideRef.value?.steps || [];
    const nextStep = steps?.find(step => step?.order === currentStep.order - 1);
    if (nextStep && nextStep?.uuid) {
      activeStepId.value = nextStep?.uuid;
    } else {
      activeStepId.value = steps[steps.length - 1]?.uuid;
    }
  }

  function selectAnswer(
    stepUuid: string,
    questionUuid: string,
    selectedAnswers: string[]
  ) {
    guideResponseRef.value = {
      ...guideResponseRef.value,
      [stepUuid]: {
        ...guideResponseRef.value[stepUuid],
        [questionUuid]: selectedAnswers
      }
    };
  }

  async function submitGuideResponse() {
    guideSubmittingRef.value = true;

    const response: Omit<GuideResponseInput, 'timestamp'> = {
      uuid: uuidv4(),
      guideUuid: uuid,
      from: web3.value.account,
      steps: Object.keys(guideResponseRef.value).map(
        (stepUuid): GuideStepResponse => {
          const stepResponse = guideResponseRef.value[stepUuid];
          return {
            uuid: stepUuid,
            questionResponses: Object.keys(stepResponse).map(
              (questionUuid): GuideQuestionResponse => {
                return {
                  uuid: questionUuid,
                  selectedAnswerKeys: stepResponse[questionUuid]
                };
              }
            )
          };
        }
      )
    };
    const result = await send(space, 'guideResponse', response);
    if (result?.id) {
      notify(['green', t('notify.guideResponseSubmitted')]);
    }
    guideSubmittingRef.value = false;
  }

  return {
    activeStepId,
    goToNextStep,
    goToPreviousStep,
    guideLoaded,
    guideRef,
    guideResponseRef,
    guideSubmittingRef,
    initialize,
    selectAnswer,
    setActiveStep,
    submitGuideResponse
  };
}
