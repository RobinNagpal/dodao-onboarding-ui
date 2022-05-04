<script setup lang="ts">
import { getBlockchain } from '@/helpers/network';
import { toRefs } from 'vue';
import blockchains from '@/helpers/jsons/blockchains.json';
import { useWeb3 } from '@/composables/useWeb3';
import UiButton from '@/components/Ui/Button.vue';

const props = defineProps(['open']);

const emit = defineEmits(['close']);

const { open } = toRefs(props);

const allBlockchains = Object.values(blockchains);

const { isEthBlockchain, isNearBlockchain, isOneBlockchain, isSolBlockchain } =
  useWeb3();

const openBlockchainDAOs = (blockchainId: string) => {
  if (blockchainId !== getBlockchain().toString()) {
    window.open(blockchains[blockchainId].url, '_blank');
  }
  emit('close');
};
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template v-slot:header>
      <h3>{{ $t('topNav.browseByBlockchain') }}</h3>
    </template>

    <div>
      <div class="m-4 space-y-2">
        <a
          v-for="blockchain in allBlockchains"
          :key="blockchain.id"
          @click="openBlockchainDAOs(blockchain.id)"
          target="_blank"
          class="block"
        >
          <UiButton
            :class="[
              {
                selected_blockchain:
                  (blockchain.id === 'ETH' && isEthBlockchain) ||
                  (blockchain.id === 'NEAR' && isNearBlockchain) ||
                  (blockchain.id === 'SOL' && isSolBlockchain) ||
                  (blockchain.id === 'ONE' && isOneBlockchain)
              }
            ]"
            class="button-outline w-full flex justify-center items-center"
          >
            <span class="w-[2rem]">
              <img
                :src="blockchain.logo"
                class="w-[1.5rem] h-auto"
                :alt="blockchain.name"
              />
            </span>
            <span class="w-[4rem]"> {{ blockchain.name }} </span>
          </UiButton>
        </a>
      </div>
    </div>
  </UiModal>
</template>

<style scoped lang="scss">
.button.selected_blockchain {
  border-color: var(--primary-color);
}
</style>
