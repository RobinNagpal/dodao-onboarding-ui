<script setup lang="ts">
import { GnosisWalletParams } from '@/components/Space/GnosisWallet/gnosisWalletParams';
import { PropType } from 'vue';
import { shorten } from '@/helpers/utils';

defineProps({
  params: { type: Object as PropType<GnosisWalletParams>, required: true }
});
</script>

<template>
  <div>
    <div v-text="`Token - ${params.data.tokenName || shorten(params.data.tokenContractAddress)}`" />
    <div v-text="`Symbol - ${params.data.tokenSymbol || 'Not Found'}`" />
    <div v-text="`Balance - ${params.data.balance || 'Not Found'}`" />
  </div>
</template>
