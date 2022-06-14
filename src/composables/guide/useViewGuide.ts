import { TempGuideSubmission } from '@/composables/guide/TempGuideSubmission';
import { useClient } from '@/composables/useClient';
import { useWeb3 } from '@/composables/useWeb3';
import { GuideQuery_guide, GuideQuery_guide_steps } from '@/graphql/generated/graphqlDocs';
import guideSubmissionCache from '@/helpers/guideSubmissionCache';
import { getGuide } from '@/helpers/snapshot';
import { GuideSubmissionInput } from '@dodao/onboarding-schemas/inputs/GuideSubmissionInput';
import { isUserDiscordConnect, isUserInput } from '@dodao/onboarding-schemas/models/GuideModel';
import {
  GuideStepItemSubmission,
  GuideStepSubmission,
  GuideSubmission,
  StepItemSubmissionType,
  UserDiscordInfo
} from '@dodao/onboarding-schemas/models/GuideSubmissionModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

export function useViewGuide(uuid: string, stepOrder: number, notify: any, space: SpaceModel) {
  const router = useRouter();
  const { send } = useClient();
  const { web3 } = useWeb3();
  const { t } = useI18n();

  const guideRef = ref<GuideQuery_guide>();
  const guideStepsMap = ref<{ [uuid: string]: GuideQuery_guide_steps }>({});

  const guideSubmissionRef = ref<TempGuideSubmission>({
    activeStepOrder: 0,
    responses: {}
  });

  const guideLoaded = ref<boolean>(false);
  const guideSubmittingRef = ref<boolean>(false);
  const guideSubmission = ref<GuideSubmission | null>(null);
  const activeStepOrder = ref<number>(0);

  async function initialize() {
    activeStepOrder.value = stepOrder - 1;
    const guide = await getGuide(uuid);
    guideRef.value = {
      ...guide,
      __typename: 'Guide',
      steps: [
        ...guide.steps,
        {
          __typename: 'GuideStep',
          content: 'The guide has been completed successfully!',
          name: 'Completed',
          order: guide.steps.length,
          uuid: 'UUID',
          stepItems: [],
          id: 'some_id',
          created: new Date().getTime()
        }
      ]
    };

    readGuideSubmissions();
    guideStepsMap.value = Object.fromEntries<GuideQuery_guide_steps>(guide.steps.map(step => [step.uuid, step]));

    guideLoaded.value = true;
  }

  function saveGuideSubmissionToLocalStorage() {
    guideSubmissionCache.saveGuideSubmission(uuid, guideSubmissionRef.value);
  }

  function setActiveStep(order) {
    activeStepOrder.value = order;
  }

  function goToNextStep(currentStep: GuideQuery_guide_steps) {
    activeStepOrder.value = currentStep.order + 1;
    const navigateToLastStep = activeStepOrder.value === (guideRef.value?.steps || []).length - 1;

    if (!navigateToLastStep) {
      saveGuideSubmissionToLocalStorage();
    }

    router.push({
      name: 'guide',
      params: {
        stepOrder: activeStepOrder.value
      }
    });
  }

  function goToPreviousStep(currentStep: GuideQuery_guide_steps) {
    activeStepOrder.value = currentStep.order - 1;
    saveGuideSubmissionToLocalStorage();
    router.push({
      name: 'guide',
      params: {
        uuid,
        stepOrder: activeStepOrder.value
      }
    });
  }

  function selectAnswer(stepUuid: string, questionUuid: string, selectedAnswers: string[]) {
    updateItemValue(stepUuid, questionUuid, selectedAnswers);
  }

  function setUserInput(stepUuid: string, userInputUuid: string, userInput: string) {
    updateItemValue(stepUuid, userInputUuid, userInput);
  }

  function setUserDiscord(stepUuid: string, userDiscordUuid: string, userDiscordId: string) {
    updateItemValue(stepUuid, userDiscordUuid, userDiscordId);
  }

  function updateItemValue(stepUuid: string, itemUuid: string, itemValue: string | string[]) {
    guideSubmissionRef.value = {
      ...guideSubmissionRef.value,
      responses: {
        ...guideSubmissionRef.value.responses,
        [stepUuid]: {
          ...guideSubmissionRef.value.responses?.[stepUuid],
          [itemUuid]: itemValue
        }
      }
    };
    saveGuideSubmissionToLocalStorage();
  }

  async function submitGuide() {
    guideSubmittingRef.value = true;

    const responses = guideSubmissionRef.value.responses;
    const response: Omit<GuideSubmissionInput, 'timestamp'> = {
      space: space.id,
      uuid: uuidv4(),
      guideUuid: uuid,
      from: web3.value.account,
      steps: Object.keys(responses).map((stepUuid): GuideStepSubmission => {
        const stepResponse = responses[stepUuid];

        return {
          uuid: stepUuid,
          itemResponses: Object.keys(stepResponse).map((itemUuid): GuideStepItemSubmission => {
            const stepItem = guideStepsMap.value[stepUuid].stepItems.find(item => item.uuid === itemUuid)!;
            if (isUserInput(stepItem)) {
              return {
                uuid: itemUuid,
                userInput: stepResponse[itemUuid] as string,
                type: StepItemSubmissionType.UserInput
              };
            } else if (isUserDiscordConnect(stepItem)) {
              return {
                uuid: itemUuid,
                userDiscordInfo: stepResponse[itemUuid] as UserDiscordInfo,
                type: StepItemSubmissionType.UserDiscordConnect
              };
            } else {
              return {
                uuid: itemUuid,
                selectedAnswerKeys: stepResponse[itemUuid] as string[],
                type: StepItemSubmissionType.Question
              };
            }
          })
        };
      })
    };
    const submissionResponse = await send(space, 'guideResponse', response);

    if (submissionResponse?.id) {
      notify(['green', t('notify.guideResponseSubmitted')]);

      guideSubmission.value = submissionResponse?.result;
      const result = guideSubmission.value?.result;
      if (result) {
        console.log('result', result);
        guideSubmissionCache.deleteGuideSubmission(uuid);
        const lastStepContent = `
      The guide has been completed successfully!
      
      You got ${result.correctQuestions.length} correct out of ${result.allQuestions.length} questions
      `;

        guideRef.value = {
          ...guideRef.value!,
          steps: [
            ...guideRef.value?.steps?.slice(0, -1)!,
            {
              __typename: 'GuideStep',
              content: lastStepContent,
              name: 'Completed',
              order: guideRef.value!.steps.length - 1,
              uuid: 'UUID',
              stepItems: [],
              id: 'some_id',
              created: new Date().getTime()
            }
          ]
        };
      }
    }

    guideSubmittingRef.value = false;
  }

  function readGuideSubmissions() {
    const answerCache = guideSubmissionCache.readGuideSubmissionsCache(uuid);
    guideSubmissionRef.value = {
      ...guideSubmissionRef.value,
      ...(answerCache || {})
    };
  }

  return {
    activeStepOrder: guideSubmissionRef.value.activeStepOrder,
    goToNextStep,
    goToPreviousStep,
    guideLoaded,
    guideRef,
    guideResponseRef: computed(() => guideSubmissionRef.value.responses),
    guideSubmission,
    guideSubmittingRef,
    initialize,
    selectAnswer,
    setActiveStep,
    submitGuide,
    setUserInput,
    setUserDiscord
  };
}
