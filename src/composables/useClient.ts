import { TempGuideBundleInput } from '@/composables/guide/EmptyGuideBundle';
import { useNotifications } from '@/composables/useNotifications';
import { useWeb3 } from '@/composables/useWeb3';
import client from '@/helpers/client';
import clientEIP712 from '@/helpers/clientEIP712';
import clientGnosisSafe from '@/helpers/clientGnosisSafe';
import { getInstance } from '@/utils/auth/auth';
import { AuthConnector } from '@/utils/auth/authConnector';
import { GuideBundleInput } from '@dodao/onboarding-schemas/inputs/GuideBundleInput';
import { GuideInput } from '@dodao/onboarding-schemas/inputs/GuideInput';
import { GuideSubmissionInput } from '@dodao/onboarding-schemas/inputs/GuideSubmissionInput';
import { SpaceSettingsInput } from '@dodao/onboarding-schemas/inputs/SpaceInput';
import {
  GuideQuestion,
  GuideStep,
  isQuestion,
  isUserInput,
  UserInput
} from '@dodao/onboarding-schemas/models/GuideModel';
import { MsgResponse } from '@dodao/onboarding-schemas/response/MsgResponse';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export function useClient() {
  const { t } = useI18n();
  const { web3 } = useWeb3();
  const auth = getInstance();
  const { notify } = useNotifications();

  const loading = ref(false);

  const connectorName = computed(() => auth.provider.value?.connectorName);

  const usePersonalSign = computed(() => {
    return (
      connectorName.value === 'walletlink' ||
      connectorName.value === 'walletconnect' ||
      connectorName.value === 'portis' ||
      connectorName.value === 'gnosis' ||
      web3.value.isTrezor
    );
  });

  const isGnosisSafe = computed(
    () =>
      web3.value?.walletConnectType === 'Gnosis Safe Multisig' ||
      connectorName.value === 'gnosis'
  );

  async function send(space, type, payload): Promise<MsgResponse | undefined> {
    loading.value = true;
    try {
      // disabled to fix the issue with wallet connect
      const usePersonal = usePersonalSign.value && false;
      if (usePersonal) {
        if (payload.proposal) payload.proposal = payload.proposal.id;
        const clientPersonalSign = isGnosisSafe.value
          ? clientGnosisSafe
          : client;
        // @ts-ignore
        return await clientPersonalSign.broadcast(
          auth.web3,
          web3.value.account,
          space.id,
          type,
          payload
        );
      }
      return await sendEIP712(space, type, payload);
    } catch (e: any) {
      console.error(e);
      const errorMessage =
        e && e.error_description
          ? `Oops, ${e.error_description}`
          : t('notify.somethingWentWrong');
      notify(['red', errorMessage]);
      return e;
    } finally {
      loading.value = false;
    }
  }

  async function sendEIP712(
    space,
    type,
    payload
  ): Promise<MsgResponse | undefined> {
    if (type === 'guide') {
      const guideMessage: GuideInput = {
        uuid: payload.uuid,
        categories: payload.categories || [],
        postSubmissionStepContent: payload.postSubmissionStepContent || '',
        content: payload.content,
        discordRoleIds: payload.discordRoleIds,
        discordRolePassingCount: payload.discordRolePassingCount || 0,
        discordWebhook: payload.discordWebhook || '',
        from: web3.value.account,
        guideType: payload.guideType,
        name: payload.name,
        publishStatus: payload.publishStatus,
        showIncorrectOnCompletion: payload.showIncorrectOnCompletion,
        socialShareImage: payload.socialShareImage || '',
        space: space.id,
        steps: payload.steps.map((step: GuideStep) => ({
          uuid: step.uuid,
          name: step.name,
          content: step.content,
          order: step.order,
          stepItems: (step.stepItems || [])
            .map(item => {
              if (isQuestion(item)) {
                const question = item as GuideQuestion;

                return {
                  uuid: question.uuid,
                  content: question.content,
                  choices: (question.choices || []).map(choice => ({
                    key: choice.key,
                    content: choice.content,
                    order: choice.order
                  })),
                  answerKeys: question.answerKeys,
                  type: question.type,
                  order: question.order
                };
              } else if (isUserInput(item)) {
                const userInput = item as UserInput;
                return {
                  uuid: userInput.uuid,
                  content: '',
                  label: userInput.label,
                  required: userInput.required,
                  type: userInput.type,
                  order: userInput.order,
                  answerKeys: [],
                  choices: []
                };
              }
            })
            .filter(Boolean)
        })),
        thumbnail: payload.thumbnail || ''
      };
      return (await clientEIP712.guide(
        auth.web3,
        web3.value.account,
        guideMessage
      )) as MsgResponse;
    } else if (type === 'guideBundle') {
      const bundlePayload = payload as TempGuideBundleInput;
      const bundleMessage: GuideBundleInput = {
        uuid: bundlePayload.uuid,
        bundleGuides: bundlePayload.bundleGuides.map(g => ({
          guideUuid: g.guide!.uuid,
          order: g.order
        })),
        bundleType: bundlePayload.bundleType,
        categories: bundlePayload.categories || [],
        content: bundlePayload.content,
        discordWebhook: bundlePayload.discordWebhook || '',
        excerpt: bundlePayload.excerpt,
        from: web3.value.account,
        name: bundlePayload.name,
        publishStatus: payload.publishStatus,
        socialShareImage: payload.socialShareImage || '',
        space: space.id,
        thumbnail: bundlePayload.thumbnail || ''
      };
      return (await clientEIP712.bundle(
        auth.web3,
        web3.value.account,
        bundleMessage
      )) as MsgResponse;
    } else if (type === 'vote') {
      return (await clientEIP712.vote(auth.web3, web3.value.account, {
        space: space.id,
        proposal: payload.proposal.id,
        type: payload.proposal.type,
        choice: payload.choice,
        metadata: JSON.stringify({})
      })) as MsgResponse;
    } else if (type === 'delete-proposal') {
      return (await clientEIP712.cancelProposal(auth.web3, web3.value.account, {
        space: space.id,
        proposal: payload.proposal.id
      })) as MsgResponse;
    } else if (type === 'settings') {
      const spaceSettingsInput: SpaceSettingsInput = {
        ...payload,
        about: payload.about || '',
        admins: payload.admins || [],
        avatar: payload.avatar || '',
        creator: web3.value.account,
        categories: payload.categories || [],
        members: payload.members || [],
        github: payload.github || '',
        mission: payload.mission || '',
        network: payload.network || '',
        skin: payload.skin || 'default',
        terms: payload.terms || '',
        twitter: payload.twitter || '',
        blockchain: payload.blockchain
      };
      return (await clientEIP712.upsertSpace(auth.web3, web3.value.account, {
        space: space.id,
        from: web3.value.account,
        settings: spaceSettingsInput,
        timestamp: parseInt((Date.now() / 1e3).toFixed())
      })) as MsgResponse;
    } else if (type === 'guideResponse') {
      const guideResponseInput: GuideSubmissionInput = {
        ...payload,
        timestamp: parseInt((Date.now() / 1e3).toFixed())
      };
      return (await clientEIP712.createGuideResponse(
        auth.web3,
        web3.value.account,
        guideResponseInput
      )) as MsgResponse;
    } else {
      throw new Error('Unknown type ' + type);
    }
  }

  async function sendLogin(connector: AuthConnector) {
    return (await clientEIP712.login(auth.web3, web3.value.account, {
      connector: connector === AuthConnector.injected ? 'metamask' : connector
    })) as { jwt: string };
  }

  return {
    send,
    clientLoading: computed(() => loading.value),
    isGnosisSafe,
    sendLogin
  };
}
