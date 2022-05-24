import { useClient } from '@/composables/useClient';
import { useWeb3 } from '@/composables/useWeb3';
import {
GuideQuery_guide,
GuideQuery_guide_steps
} from '@/graphql/generated/graphqlDocs';
import guideSubmissionCache from '@/helpers/guideSubmissionCache';
import { getGuide } from '@/helpers/snapshot';
import { GuideSubmissionInput } from '@dodao/onboarding-schemas/inputs/GuideSubmissionInput';
import { InputType } from '@dodao/onboarding-schemas/models/GuideModel';
import {
GuideStepItemSubmission,
GuideStepSubmission,
GuideSubmission,
StepItemSubmissionType
} from '@dodao/onboarding-schemas/models/GuideSubmissionModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { v4 as uuidv4 } from 'uuid';
import { computed,ref,watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute,useRouter } from 'vue-router';

export type UserGuideQuestionSubmission = Record<string, string[] | string>;

export function useViewGuide(uuid: string, notify: any, space: SpaceModel) {
  const route = useRoute();
  const router = useRouter();
  const { send } = useClient();
  const { web3 } = useWeb3();
  const { t } = useI18n();

  const stepOrder = computed<number>(
    () => parseInt(route.params.stepOrder?.toString()) || 1
  );

  const guideRef = ref<GuideQuery_guide>();
  const guideStepsMap = ref<{ [uuid: string]: GuideQuery_guide_steps }>({});
  const guideSubmissionRef = ref<Record<string, UserGuideQuestionSubmission>>(
    {}
  );
  const guideLoaded = ref<boolean>(false);
  const guideSubmittingRef = ref<boolean>(false);
  const guideSubmission = ref<GuideSubmission | null>(null);
  const activeStepOrder = ref<number>(0);

  async function initialize() {
    activeStepOrder.value = stepOrder.value - 1;
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
    if (web3.value.account) {
      guideSubmissionCache.setAccount(web3.value.account);
    }
    readGuideSubmissions();
    guideStepsMap.value = Object.fromEntries<GuideQuery_guide_steps>(
      guide.steps.map(step => [step.uuid, step])
    );

    guideLoaded.value = true;
  }

  function setActiveStep(order) {
    activeStepOrder.value = order;
  }

  function goToNextStep(currentStep: GuideQuery_guide_steps) {
    router.push({
      name: 'guide',
      params: {
        stepOrder: currentStep.order + 2
      }
    });
  }

  function goToPreviousStep(currentStep: GuideQuery_guide_steps) {
    router.push({
      name: 'guide',
      params: {
        uuid,
        stepOrder: currentStep.order
      }
    });
  }

  function selectAnswer(
    stepUuid: string,
    questionUuid: string,
    selectedAnswers: string[]
  ) {
    guideSubmissionRef.value = {
      ...guideSubmissionRef.value,
      [stepUuid]: {
        ...guideSubmissionRef.value[stepUuid],
        [questionUuid]: selectedAnswers
      }
    };
    guideSubmissionCache.saveGuideSubmission(uuid, {
      // fetchedFromServer: false,
      data: guideSubmissionRef.value
    });
  }

  function setUserInput(
    stepUuid: string,
    userInputUuid: string,
    userInput: string
  ) {
    guideSubmissionRef.value = {
      ...guideSubmissionRef.value,
      [stepUuid]: {
        ...guideSubmissionRef.value[stepUuid],
        [userInputUuid]: userInput
      }
    };
    guideSubmissionCache.saveGuideSubmission(uuid, {
      // fetchedFromServer: false,
      data: guideSubmissionRef.value
    });
  }

  function setUserDiscord(
    stepUuid: string,
    userDiscordUuid: string,
    userDiscordId: string
  ) {
    guideSubmissionRef.value = {
      ...guideSubmissionRef.value,
      [stepUuid]: {
        ...guideSubmissionRef.value[stepUuid],
        [userDiscordUuid]: userDiscordId
      }
    };
    guideSubmissionCache.saveGuideSubmission(uuid, {
      // fetchedFromServer: false,
      data: guideSubmissionRef.value
    });
  }

  async function submitGuide() {
    guideSubmittingRef.value = true;

    const response: Omit<GuideSubmissionInput, 'timestamp'> = {
      space: space.id,
      uuid: uuidv4(),
      guideUuid: uuid,
      from: web3.value.account,
      steps: Object.keys(guideSubmissionRef.value).map(
        (stepUuid): GuideStepSubmission => {
          const stepResponse = guideSubmissionRef.value[stepUuid];

          return {
            uuid: stepUuid,
            itemResponses: Object.keys(stepResponse).map(
              (itemUuid): GuideStepItemSubmission => {
                const stepItem = guideStepsMap.value[stepUuid].stepItems.find(
                  item => item.uuid === itemUuid
                )!;
                if (
                  stepItem.type === InputType.PrivateShortInput ||
                  stepItem.type === InputType.PublicShortInput
                ) {
                  return {
                    uuid: itemUuid,
                    userInput: stepResponse[itemUuid] as string,
                    type: StepItemSubmissionType.Question
                  };
                } else {
                  return {
                    uuid: itemUuid,
                    selectedAnswerKeys: stepResponse[itemUuid] as string[],
                    type: StepItemSubmissionType.Question
                  };
                }
              }
            )
          };
        }
      )
    };
    const submissionResponse = await send(space, 'guideResponse', response);
    if (submissionResponse?.id) {
      notify(['green', t('notify.guideResponseSubmitted')]);
    }

    guideSubmission.value = submissionResponse?.result;
    const result = guideSubmission.value?.result;
    if (result) {
      console.log('result', result);
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

    guideSubmittingRef.value = false;
  }

  function readGuideSubmissions() {
    const answerCache = guideSubmissionCache.readGuideSubmissionsCache(uuid);
    guideSubmissionRef.value = {
      ...guideSubmissionRef.value,
      ...(answerCache?.data || {})
    };
  }

  watch(stepOrder, newVal => {
    activeStepOrder.value = newVal - 1;
  });
  watch(
    web3.value,
    newVal => {
      if (newVal.account) {
        guideSubmissionCache.setAccount(newVal.account);
      }
      if (route.params.discordId && route.params.itemUuid) {
        setUserDiscord(
          route.params.stepUuid?.toString(),
          route.params.itemUuid?.toString(),
          route.params.discordId?.toString()
        );
      }
      readGuideSubmissions();
    },
    { immediate: true }
  );

  return {
    activeStepOrder,
    goToNextStep,
    goToPreviousStep,
    guideLoaded,
    guideRef,
    guideResponseRef: guideSubmissionRef,
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
