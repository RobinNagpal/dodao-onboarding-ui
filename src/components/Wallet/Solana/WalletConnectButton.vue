<script lang="ts">
import { useWeb3Wrapper } from '@/composables/useWeb3Wrapper';
import { AuthConnector } from '@/utils/auth/authConnector';
import { useSolanaWallet } from '@/utils/solana/useSolanaWallet';
import { computed, defineComponent, toRefs } from 'vue';
import WalletIcon from './WalletIcon.vue';

export default defineComponent({
  components: {
    WalletIcon
  },
  props: {
    disabled: Boolean
  },
  setup(props, { emit }) {
    const { disabled } = toRefs(props);
    const { wallet, connecting, connected } = useSolanaWallet();

    const { loginWrapper } = useWeb3Wrapper();
    const content = computed(() => {
      if (connecting.value) return 'Connecting ...';
      if (connected.value) return 'Connected';
      if (wallet.value) return 'Connect';
      return 'Connect Wallet';
    });

    const onClick = (event: MouseEvent) => {
      emit('click', event);
      if (event.defaultPrevented) return;
      loginWrapper(wallet.value?.name as AuthConnector);
    };

    const scope = {
      wallet,
      disabled,
      connecting,
      connected,
      content,
      onClick
    };

    return {
      scope,
      ...scope
    };
  }
});
</script>

<template>
  <slot v-bind="scope">
    <button
      class="swv-button swv-button-trigger"
      :disabled="disabled || !wallet || connecting || connected"
      @click="onClick"
    >
      <wallet-icon v-if="wallet" :wallet="wallet"></wallet-icon>
      <p v-text="content"></p>
    </button>
  </slot>
</template>
