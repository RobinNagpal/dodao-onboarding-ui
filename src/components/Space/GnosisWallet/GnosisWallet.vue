<script setup lang="ts">
import { GnosisWalletParams } from '@/components/Space/GnosisWallet/gnosisWalletParams';
import { computed, PropType } from 'vue';
import { GnosisNetWorkList } from '@/constants/gnosisNetworkList';

const props = defineProps({
  params: { type: Object as PropType<GnosisWalletParams>, required: true }
});

const chainName = computed(() => GnosisNetWorkList.find(chain => chain.chainId === props.params.data.chainId)?.name);
</script>

<template>
  <div>
    <div v-text="params.data.walletName" />
    <div v-text="params.data.walletAddress" />
    <div v-text="chainName" />
  </div>
</template>
<style></style>
