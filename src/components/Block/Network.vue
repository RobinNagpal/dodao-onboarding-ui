<script setup lang="ts">
import { Blockchain, getBlockchain } from '@/helpers/network';
import { n } from '@/helpers/utils';

const props = defineProps(['network']);

function getLogoUrl(key) {
  return `/static/icons/networks/${key}.png`;
}

console.log('props', props);
const isEthereum = getBlockchain() === Blockchain.ETH;
</script>

<template>
  <Block class="hover-border">
    <div class="flex items-center mb-1">
      <UiAvatar
        class="mr-2 mb-2"
        :imgsrc="getLogoUrl(network.key)"
        :seed="network.key"
        size="28"
        v-if="isEthereum"
      />
      <h3 v-text="network.name" />
      <div v-text="network.key" class="ml-1 text-color" />
    </div>
    <div class="text-color">
      {{ $tc('inSpaces', [n(network.spaces)]) }}
    </div>
  </Block>
</template>
