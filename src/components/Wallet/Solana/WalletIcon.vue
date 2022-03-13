<script lang="ts">
import { Wallet } from '@/utils/solana/createWalletStore';
import { defineComponent, PropType, toRefs } from 'vue';

export default defineComponent({
  props: {
    wallet: Object as PropType<Wallet>
  },
  setup(props) {
    return toRefs(props);
  }
});
</script>

<template>
  <i class="swv-button-icon">
    <img v-if="wallet" :src="wallet.icon" :alt="`${wallet.name} icon`" />
  </i>
</template>
