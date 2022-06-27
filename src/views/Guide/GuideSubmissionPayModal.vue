<script setup lang="ts">
import UiButton from '@/components/Ui/Button.vue';
import UiDropdown from '@/components/Ui/Dropdown.vue';
import UiInput from '@/components/Ui/Input.vue';
import UiModal from '@/components/Ui/Modal.vue';
import { GnosisNetWorkList } from '@/constants/gnosisNetworkList';
import {
  ExtendedSpace_space_spaceIntegrations_gnosisSafeWallets,
  GuideSubmissionsQuery_guideSubmissions
} from '@/graphql/generated/graphqlDocs';
import { formatWallet } from '@/helpers/gnosisWallet';
import { FormattedGnosisWallet } from '@/types/space/formattedGnosisWallet';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { Network } from '@ethersproject/networks/src.ts/types';
import Safe from '@gnosis.pm/safe-core-sdk';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import { ethers } from 'ethers';
import { onMounted, PropType, ref } from 'vue';

const props = defineProps({
  open: Boolean,
  space: { type: Object as PropType<SpaceModel>, required: true },
  selectedSubmissions: {
    type: Object as PropType<GuideSubmissionsQuery_guideSubmissions[]>
  }
});
const emit = defineEmits(['close']);

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
  if (selectedWallet.value) {
    try {
      const gnosisWallet: ExtendedSpace_space_spaceIntegrations_gnosisSafeWallets & FormattedGnosisWallet =
        selectedWallet.value;

      const networkName = GnosisNetWorkList.find(network => network.chainId === network.chainId)!.network;
      const network: Network = {
        name: networkName,
        chainId: gnosisWallet.chainId
      };
      const etherscanProvider = new ethers.providers.EtherscanProvider(networkName);
      const jsonRpcProvider = new ethers.providers.JsonRpcProvider(etherscanProvider.getBaseUrl(), network);
      const safeOwner = jsonRpcProvider.getSigner(0);

      etherscanProvider.getBaseUrl();
      const ethAdapter = new EthersAdapter({
        ethers,
        signer: safeOwner
      });

      const safeSdk: Safe = await Safe.create({ ethAdapter: ethAdapter, safeAddress: gnosisWallet.walletAddress });

      const connectedSafe = await safeSdk.connect({ ethAdapter: ethAdapter, safeAddress: gnosisWallet.walletAddress });

      const safeBalance = await connectedSafe.getBalance();
      console.log('safeBalance', safeBalance);
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
          <UiInput type="number" :modelValue="''" class="flex-1" placeholder="Amount to Pay">
            <template v-slot:label>Amount</template>
          </UiInput>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <div class="flex justify-around">
        <UiButton :disabled="!selectedWallet" variant="contained" @click="payForSubmissions()" primary>Ok</UiButton>
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
