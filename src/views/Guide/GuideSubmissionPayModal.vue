<script setup lang="ts">
import UiButton from '@/components/Ui/Button.vue';
import UiDropdown from '@/components/Ui/Dropdown.vue';
import UiInput from '@/components/Ui/Input.vue';
import UiModal from '@/components/Ui/Modal.vue';
import { useWeb3 } from '@/composables/useWeb3';
import { useWeb3Wrapper } from '@/composables/useWeb3Wrapper';
import { GnosisNetWorkList } from '@/constants/gnosisNetworkList';
import {
  ExtendedSpace_space_spaceIntegrations_gnosisSafeWallets,
  GuideSubmissionsQuery_guideSubmissions
} from '@/graphql/generated/graphqlDocs';
import { Signer } from '@ethersproject/abstract-signer';
import { formatWallet } from '@/helpers/gnosisWallet';
import { FormattedGnosisWallet } from '@/types/space/formattedGnosisWallet';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { Network } from '@ethersproject/networks/src.ts/types';
import { Web3Provider } from '@ethersproject/providers';
import Safe from '@gnosis.pm/safe-core-sdk';
import { MetaTransactionData } from '@gnosis.pm/safe-core-sdk-types';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import SafeServiceClient from '@gnosis.pm/safe-service-client';
import { ethers } from 'ethers';
import { onMounted, PropType, ref } from 'vue';
import SafeAppsSDK from '@gnosis.pm/safe-apps-sdk';

const props = defineProps({
  open: Boolean,
  space: { type: Object as PropType<SpaceModel>, required: true },
  selectedSubmissions: {
    type: Array as PropType<GuideSubmissionsQuery_guideSubmissions[]>,
    required: true
  }
});
const emit = defineEmits(['close']);

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
  const { web3 } = useWeb3();
  const web3Provider = web3.value.web3Provider;
  // https://safe-docs.dev.gnosisdev.com/safe/docs/tutorial_tx_service_initiate_sign/
  const txServiceUrl = 'https://safe-transaction.rinkeby.gnosis.io';
  if (selectedWallet.value && web3Provider) {
    try {
      const gnosisWallet: ExtendedSpace_space_spaceIntegrations_gnosisSafeWallets & FormattedGnosisWallet =
        selectedWallet.value;

      const safeOwner = await (web3Provider as Web3Provider).getSigner(0);

      const ethAdapter = new EthersAdapter({
        ethers,
        signer: safeOwner
      });

      const safeSdk: Safe = await Safe.create({ ethAdapter: ethAdapter, safeAddress: gnosisWallet.walletAddress });

      const connectedSafe = await safeSdk.connect({ ethAdapter: ethAdapter, safeAddress: gnosisWallet.walletAddress });
      console.log('connectedSafe', connectedSafe);
      const safeBalance = await connectedSafe.getBalance();
      console.log('safeBalance', ethers.utils.formatUnits(safeBalance, 18));
      const three_ethers = ethers.utils.parseUnits(selectedAmount.value!, 'ether').toHexString();

      // https://piyopiyo.medium.com/how-to-send-erc20-token-with-web3-js-99ed040693ce
      const minABI = [
        // transfer
        {
          constant: false,
          inputs: [
            {
              name: '_to',
              type: 'address'
            },
            {
              name: '_value',
              type: 'uint256'
            }
          ],
          name: 'transfer',
          outputs: [
            {
              name: '',
              type: 'bool'
            }
          ],
          type: 'function'
        }
      ];

      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const contract = new ethers.Contract(gnosisWallet.tokenContractAddress, minABI, web3Provider as Web3Provider);

      // https://mirror.xyz/0xa1AC2cC82249A44892802a99CA84c4ed1072B29C/lL8AYV_b4VzTbojuZEprrxD7-RTTap2IMIS8qIObfl8
      const transactions: MetaTransactionData[] = await Promise.all(
        props.selectedSubmissions.map(async receiver => {
          const unsignedTransaction = await contract.populateTransaction.transfer(receiver.createdBy, '2');
          return {
            to: receiver.createdBy,
            value: '2',
            data: unsignedTransaction.data!
          };
        })
      );

      const txs = await safeSdk.createTransaction(transactions);

      // const paymentTsx: MetaTransactionData[] = props.selectedSubmissions.map(
      //   (sub: GuideSubmissionsQuery_guideSubmissions): MetaTransactionData => ({
      //     to: sub.createdBy,
      //     value: '3',
      //     data: '0x'
      //   })
      // );
      // const txs = await safeSdk.createTransaction(paymentTsx);
      const hash = await safeSdk.getTransactionHash(txs);

      const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });
      await safeService.proposeTransaction({
        safeAddress: gnosisWallet.walletAddress,
        safeTransaction: txs,
        safeTxHash: hash,
        senderAddress: web3.value.account,
        origin
      });

      const txResponse = await safeSdk.approveTransactionHash(hash);
      await txResponse.transactionResponse?.wait();

      console.log('txs', txs);
    } catch (e) {
      console.error(e);
    }
  }
}
</script>

<template>
  <UiModal :open="open" @close="$emit('close')" class="flex">
    <template v-slot:header>
      <h3>Batch Pay</h3>
      <div>Pay the following submissions:</div>
    </template>
    <div class="flex flex-col flex-auto my-2 mx-2 modal-body">
      <div class="px-2">
        <div>Selected Submission:</div>
        <div class="flex items-center my-2" :key="item.id" v-for="item in selectedSubmissions">
          <div class="mr-4 rounded-2xl bg-skin-header-bg px-3 py-1">{{ shortenAddr(item.createdBy) }}</div>
          <div class="rounded-2xl bg-skin-header-bg px-3 py-1">
            {{ item.result.correctQuestions.length }}/{{ item.result.allQuestions.length }}
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
              <template v-slot:label>Select Your Wallet</template>
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
            <template v-slot:label>Wallet Address</template>
          </UiInput>
        </div>
        <div class="w-full md:w-1/2 px-2">
          <UiInput
            :modelValue="selectedWallet?.tokenContractAddress"
            class="flex-1 opacity-50"
            placeholder="Contract"
            :disabled="true"
          >
            <template v-slot:label>Contract</template>
          </UiInput>
        </div>
        <div class="w-full md:w-1/2 px-2">
          <UiInput
            :modelValue="selectedWallet?.tokenName"
            class="flex-1 opacity-50"
            placeholder="Token Name"
            :disabled="true"
          >
            <template v-slot:label>Token Name</template>
          </UiInput>
        </div>
        <div class="w-full md:w-1/2 px-2">
          <UiInput
            :modelValue="selectedWallet?.balance"
            class="flex-1 opacity-50"
            placeholder="tokenContractAddress"
            :disabled="true"
          >
            <template v-slot:label>Balance</template>
          </UiInput>
        </div>
      </div>
      <div v-if="selectedWallet">
        <div class="w-full md:w-1/2 px-2">
          <UiInput type="number" v-model="selectedAmount" class="flex-1" placeholder="Amount to Pay">
            <template v-slot:label>Amount</template>
          </UiInput>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <div class="flex justify-around">
        <UiButton
          :disabled="!selectedWallet || !selectedAmount"
          variant="contained"
          @click="payForSubmissions()"
          primary
          >Ok</UiButton
        >
        <UiButton @click="$emit('close')">Cancel</UiButton>
      </div>
    </template>
  </UiModal>
</template>
<style lang="scss" scoped>
.modal-body {
  min-height: 320px;
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
