<script setup lang="ts">
import UiButton from '@/components/Ui/Button.vue';
import UiDropdown from '@/components/Ui/Dropdown.vue';
import UiInput from '@/components/Ui/Input.vue';
import UiModal from '@/components/Ui/Modal.vue';
import { useWeb3 } from '@/composables/useWeb3';
import { GnosisNetWorkList } from '@/constants/gnosisNetworkList';
import {
  ExtendedSpace_space_spaceIntegrations_gnosisSafeWallets,
  GuideSubmissionsQuery_guideSubmissions
} from '@/graphql/generated/graphqlDocs';
import { formatWallet } from '@/helpers/gnosisWallet';
import i18n from '@/helpers/i18n';
import erc20Abi from '@/helpers/jsons/erc20Abi.json';
import { FormattedGnosisWallet } from '@/types/space/formattedGnosisWallet';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { Web3Provider } from '@ethersproject/providers';
import Safe from '@gnosis.pm/safe-core-sdk';
import { MetaTransactionData } from '@gnosis.pm/safe-core-sdk-types';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import SafeServiceClient, { ProposeTransactionProps } from '@gnosis.pm/safe-service-client';
import { ethers } from 'ethers';
import { inject, onMounted, PropType, ref } from 'vue';

const props = defineProps({
  open: Boolean,
  space: { type: Object as PropType<SpaceModel>, required: true },
  selectedSubmissions: {
    type: Array as PropType<GuideSubmissionsQuery_guideSubmissions[]>,
    required: true
  }
});
const emit = defineEmits(['close']);
const notify: Function = inject('notify')!;
const { t } = i18n.global;

const executingGnosisTransaction = ref(false);
const selectedAmount = ref<string | undefined>();

const formattedWallets = ref<(ExtendedSpace_space_spaceIntegrations_gnosisSafeWallets & FormattedGnosisWallet)[]>([]);

const selectedWallet = ref<
  (ExtendedSpace_space_spaceIntegrations_gnosisSafeWallets & FormattedGnosisWallet) | undefined
>();

onMounted(async () => {
  const gnosisSafeWallets = props.space.spaceIntegrations?.gnosisSafeWallets || [];
  const wallets = gnosisSafeWallets.map(formatWallet);
  formattedWallets.value = await Promise.all(wallets);
});

function shortenAddr(addr = '') {
  if (!addr) return '';
  return addr.substring(0, 4) + '...' + addr.substring(addr.length - 4);
}

async function payForSubmissions() {
  executingGnosisTransaction.value = true;
  const { web3 } = useWeb3();
  const web3Provider = web3.value.web3Provider;
  const gnosisNetwork = GnosisNetWorkList.find(gnosis => gnosis.chainId === selectedWallet.value?.chainId);
  if (selectedWallet.value && web3Provider && gnosisNetwork) {
    try {
      const gnosisWallet: ExtendedSpace_space_spaceIntegrations_gnosisSafeWallets & FormattedGnosisWallet =
        selectedWallet.value;

      const txServiceUrl = gnosisNetwork.txServiceUrl;

      const safeOwner = await (web3Provider as Web3Provider).getSigner(0);

      const ethAdapter = new EthersAdapter({
        ethers,
        signer: safeOwner
      });

      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const contract = new ethers.Contract(gnosisWallet.tokenContractAddress, erc20Abi, web3Provider as Web3Provider);

      const safeSdk: Safe = await Safe.create({ ethAdapter: ethAdapter, safeAddress: gnosisWallet.walletAddress });

      const decimals = await contract.decimals();

      const tokensToPay = ethers.utils.parseUnits(selectedAmount.value!, decimals).toHexString();

      console.log('tokensToPay', tokensToPay);
      // https://mirror.xyz/0xa1AC2cC82249A44892802a99CA84c4ed1072B29C/lL8AYV_b4VzTbojuZEprrxD7-RTTap2IMIS8qIObfl8
      const transactions: MetaTransactionData[] = await Promise.all(
        props.selectedSubmissions.map(async receiver => {
          const unsignedTransaction = await contract.populateTransaction.transfer(receiver.createdBy, tokensToPay);
          return {
            to: gnosisWallet.tokenContractAddress,
            value: '0',
            data: unsignedTransaction.data!
          };
        })
      );

      console.log('create transactions:', transactions);
      const txs = await safeSdk.createTransaction(transactions);

      const hash = await safeSdk.getTransactionHash(txs);

      const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });
      const formattedDate = new Date().toISOString().slice(0, 19).replace(/-/g, '/').replace('T', ' ');

      console.log('propose transaction:', transactions);
      const proposeTransactionProps: ProposeTransactionProps = {
        safeAddress: gnosisWallet.walletAddress,
        safeTransaction: txs,
        safeTxHash: hash,
        senderAddress: web3.value.account,
        origin: 'DoDAO Guide Submissions - ' + formattedDate
      };
      await safeService.proposeTransaction(proposeTransactionProps);

      console.log('approve transaction hash:', hash);
      const txResponse = await safeSdk.approveTransactionHash(hash);
      await txResponse.transactionResponse?.wait();
      notify(['green', t('notify.gnosisTransactionsQueued')]);
      emit('close');
    } catch (e) {
      console.error(e);
      emit('close');
      notify(['red', t('notify.gnosisTransactionsError')]);
    }
  } else {
    notify(['red', t('notify.somethingWentWrong')]);
  }
  executingGnosisTransaction.value = false;
}
</script>

<template>
  <UiModal :open="open" @close="$emit('close')" class="flex payModal">
    <template v-slot:header>
      <h3>{{ t('guide.payModal.title') }}</h3>
      <div>{{ t('guide.payModal.description') }}</div>
    </template>
    <div class="flex flex-col flex-auto my-2 mx-2 modal-body">
      <div class="px-2">
        <div>{{ t('guide.payModal.selectedSubmission') }}:</div>
        <div class="selected-submission-list">
          <div class="flex items-center my-2" :key="item.id" v-for="item in selectedSubmissions">
            <div class="mr-4 rounded-2xl bg-skin-header-bg px-3 py-1">{{ shortenAddr(item.createdBy) }}</div>
            <div class="rounded-2xl bg-skin-header-bg px-3 py-1">
              {{ item.result.correctQuestions.length }}/{{ item.result.allQuestions.length }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-wrap">
        <div class="w-full md:w-1/2 px-2">
          <UiDropdown
            top="2.5rem"
            right="1.5rem"
            class="flex-1 ml-1 cursor-pointer dropdown-wallet"
            @select="selectedWallet = $event"
            :items="formattedWallets"
          >
            <UiInput :modelValue="selectedWallet?.walletName" class="flex-1" placeholder="0x00..." :disabled="true">
              <template v-slot:label>{{ t('guide.payModal.selectYourWallet') }}</template>
            </UiInput>
            <template v-slot:item="{ item }">
              {{ item.walletName }}
            </template>
          </UiDropdown>
        </div>
      </div>
      <div class="flex flex-wrap" v-if="selectedWallet">
        <div class="w-full md:w-1/2 px-2">
          <UiInput
            :modelValue="shortenAddr(selectedWallet?.walletAddress)"
            class="flex-1 opacity-50"
            placeholder="Contract"
            :disabled="true"
          >
            <template v-slot:label>{{ t('guide.payModal.walletAddr') }}</template>
          </UiInput>
        </div>
        <div class="w-full md:w-1/2 px-2">
          <UiInput
            :modelValue="selectedWallet?.tokenContractAddress"
            class="flex-1 opacity-50"
            placeholder="Contract"
            :disabled="true"
          >
            <template v-slot:label>{{ t('guide.payModal.contract') }}</template>
          </UiInput>
        </div>
        <div class="w-full md:w-1/2 px-2">
          <UiInput
            :modelValue="selectedWallet?.tokenName"
            class="flex-1 opacity-50"
            placeholder="Token Name"
            :disabled="true"
          >
            <template v-slot:label>{{ t('guide.payModal.tokenName') }}</template>
          </UiInput>
        </div>
        <div class="w-full md:w-1/2 px-2">
          <UiInput
            :modelValue="selectedWallet?.balance"
            class="flex-1 opacity-50"
            placeholder="tokenContractAddress"
            :disabled="true"
          >
            <template v-slot:label>{{ t('guide.payModal.balance') }}</template>
          </UiInput>
        </div>
      </div>
      <div v-if="selectedWallet">
        <div class="w-full md:w-1/2 px-2">
          <UiInput type="number" v-model="selectedAmount" class="flex-1" :placeholder="t('guide.payModal.amountToPay')">
            <template v-slot:label>{{ t('guide.payModal.amount') }}</template>
          </UiInput>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <div class="flex justify-around">
        <UiButton
          :disabled="!selectedWallet || !selectedAmount"
          :loading="executingGnosisTransaction"
          variant="contained"
          @click="payForSubmissions()"
          primary
          >{{ t('guide.payModal.ok') }}</UiButton
        >
        <UiButton @click="$emit('close')">{{ t('guide.payModal.cancel') }}</UiButton>
      </div>
    </template>
  </UiModal>
</template>
<style lang="scss" scoped>
.payModal {
  .modal-body {
    min-height: 320px;
    max-height: 500px;
  }
}

.selected-submission-list {
  margin-bottom: 4px;
  max-height: 124px;
  overflow: auto;
}

.dropdown-wallet {
  .sub-menu-wrapper {
    width: 100%;
  }
  :deep(input) {
    cursor: pointer;
  }
}

.bg-input {
}
</style>
