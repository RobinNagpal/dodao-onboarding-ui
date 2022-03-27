<script setup lang="ts">
import { getBlockchain } from '@/helpers/network';
import { toRefs } from 'vue';
import blockchains from '@/helpers/jsons/blockchains.json';
import UiModal from '@/components/Ui/Modal.vue';
import UiButton from '@/components/Ui/Button.vue';

const props = defineProps(['open']);

const emit = defineEmits(['close']);

const { open } = toRefs(props);

const allBlockchains = Object.values(blockchains);

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
            class="button-outline w-full flex justify-center items-center"
          >
            <img
              :src="blockchain.logo"
              height="28"
              width="28"
              class="mr-2 -mt-1"
              :alt="blockchain.name"
            />
            {{ blockchain.name }}
          </UiButton>
        </a>
      </div>
    </div>
  </UiModal>
</template>
