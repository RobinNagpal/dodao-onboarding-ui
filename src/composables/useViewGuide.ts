import { GuideQuery_guide_steps } from '@/graphql/generated/graphqlDocs';
import { getGuide } from '@/helpers/snapshot';
import { GuideModel } from '@dodao/onboarding-schemas/models/GuideModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { ref } from 'vue';

export type UserGuideStepResponse = Record<string, string[]>;

export function useViewGuide(uuid: string) {
  const guideRef = ref<GuideModel>();
  const guideResponseRef = ref<Record<string, UserGuideStepResponse>>({});

  const guideLoaded = ref<boolean>(false);

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

  return {
    activeStepId,
    goToNextStep,
    goToPreviousStep,
    guideLoaded,
    guideRef,
    guideResponseRef,
    initialize,
    selectAnswer,
    setActiveStep
  };
}
