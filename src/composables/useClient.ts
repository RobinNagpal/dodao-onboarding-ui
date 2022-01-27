import { useNotifications } from '@/composables/useNotifications';
import { useWeb3 } from '@/composables/useWeb3';
import client from '@/helpers/client';
import clientEIP712 from '@/helpers/clientEIP712';
import clientGnosisSafe from '@/helpers/clientGnosisSafe';
import { GuideStep } from '@/models/GuideModel';
import { getInstance } from '@snapshot-labs/lock/plugins/vue3';
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

  async function send(space, type, payload) {
    loading.value = true;
    try {
      if (usePersonalSign.value) {
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

  async function sendEIP712(space, type, payload) {
    if (type === 'proposal') {
      let plugins = {};
      if (Object.keys(payload.metadata?.plugins).length !== 0)
        plugins = payload.metadata.plugins;
      return clientEIP712.proposal(auth.web3, web3.value.account, {
        space: space.id,
        type: payload.type,
        title: payload.name,
        body: payload.body,
        choices: payload.choices,
        start: payload.start,
        end: payload.end,
        snapshot: payload.snapshot,
        network: space.network,
        strategies: JSON.stringify(space.strategies),
        plugins: JSON.stringify(plugins),
        metadata: JSON.stringify({})
      });
    } else if (type === 'guide') {
      const guideMessage = {
        uuid: payload.uuid,
        space: space.id,
        name: payload.name,
        content: payload.content,
        steps: payload.steps.map((step: GuideStep) => ({
          uuid: step.uuid,
          name: step.name,
          content: step.content,
          order: step.order,
          questions: (step.questions || []).map(question => ({
            uuid: question.uuid,
            content: question.content,
            choices: (question.choices || []).map(choice => ({
              key: choice.key,
              content: choice.content,
              order: choice.order
            })),
            answerKeys: question.answerKeys,
            questionType: question.questionType,
            order: question.order
          }))
        })),
        network: space.network,
        metadata: JSON.stringify({})
      };
      console.log('guideMessage', guideMessage);
      return clientEIP712.guide(auth.web3, web3.value.account, guideMessage);
    } else if (type === 'vote') {
      return clientEIP712.vote(auth.web3, web3.value.account, {
        space: space.id,
        proposal: payload.proposal.id,
        type: payload.proposal.type,
        choice: payload.choice,
        metadata: JSON.stringify({})
      });
    } else if (type === 'delete-proposal') {
      return clientEIP712.cancelProposal(auth.web3, web3.value.account, {
        space: space.id,
        proposal: payload.proposal.id
      });
    } else if (type === 'settings') {
      return clientEIP712.space(auth.web3, web3.value.account, {
        space: space.id,
        settings: JSON.stringify(payload)
      });
    } else {
      throw new Error('Unknown type ' + type);
    }
  }

  return { send, clientLoading: computed(() => loading.value), isGnosisSafe };
}
