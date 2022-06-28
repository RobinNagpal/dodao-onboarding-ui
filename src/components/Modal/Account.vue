<script setup lang="ts">
import { useWeb3Wrapper } from '@/composables/useWeb3Wrapper';
import { toRefs, ref, watch, computed } from 'vue';
import { getInjected } from '@snapshot-labs/lock/src/utils';
import { shorten, explorerUrl, getIpfsUrl } from '@/helpers/utils';
import allConnectors from '@/helpers/connectors.json';
import { useWeb3 } from '@/composables/useWeb3';
import UiModal from '@/components/Ui/Modal.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiAvatar from '@/components/Ui/Avatar.vue';

const props = defineProps(['open']);

const emit = defineEmits(['login', 'close']);

const { open } = toRefs(props);
const { web3, isEthBlockchain, isOneBlockchain } = useWeb3();
const { logoutWrapper } = useWeb3Wrapper();

const step = ref(null);

const injected = computed(() => getInjected());

const connectors = Object.fromEntries(
  Object.values(allConnectors)
    .filter(connector => connector.blockchain === web3.value.blockchain)
    .map(connector => [connector.id, connector])
);

const showProfileOnEtherscan = () => {
  if (isEthBlockchain.value || isOneBlockchain.value) {
    window.open(explorerUrl(web3.value.network.key, web3.value.account), '_blank');
  }
};
async function handleLogout() {
  await logoutWrapper();
  emit('close');
}

watch(open, () => (step.value = null));
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template v-slot:header>
      <h3 v-if="!web3.account || step === 'connect'">
        {{ $t('connectWallet') }}
      </h3>
      <h3 v-else>{{ $t('account') }}</h3>
    </template>

    <div v-if="!web3.account || step === 'connect'">
      <div class="m-4 space-y-2">
        <a
          v-for="(connector, id, i) in connectors"
          :key="i"
          @click="$emit('login', connector.id)"
          target="_blank"
          class="block"
        >
          <UiButton v-if="id === 'injected' && injected" class="button-outline w-full flex justify-center items-center">
            <img
              :src="`/static/icons/connectors/${injected.id}.png`"
              height="28"
              width="28"
              class="mr-2 -mt-1"
              :alt="injected.name"
            />
            {{ injected.name }}
          </UiButton>
          <UiButton v-else-if="id !== 'gnosis'" class="button-outline w-full flex justify-center items-center gap-2">
            <img :src="`/static/icons/connectors/${connector.id}.png`" height="25" width="25" :alt="connector.name" />
            <span class="mt-1">{{ connector.name }}</span>
          </UiButton>
        </a>
      </div>
    </div>
    <div v-else>
      <div v-if="$auth.isAuthenticated.value" class="m-4 space-y-2">
        <UiButton class="button-outline w-full" @click="showProfileOnEtherscan()">
          <UiAvatar :imgsrc="getIpfsUrl(web3.profile?.image)" :address="web3.account" size="18" class="mr-2 -ml-1" />
          <span v-if="web3.profile.name" v-text="web3.profile.name" />
          <span v-else-if="web3.profile.ens" v-text="web3.profile.ens" />
          <span v-else v-text="shorten(web3.account)" />
          <Icon v-if="isEthBlockchain || isOneBlockchain" name="external-link" class="ml-1" />
        </UiButton>
        <UiButton
          v-if="isEthBlockchain || isOneBlockchain"
          @click="step.value = 'connect'"
          class="button-outline w-full"
        >
          {{ $t('connectWallet') }}
        </UiButton>
        <UiButton @click="handleLogout" class="button-outline w-full !text-red">
          {{ $t('logout') }}
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>
