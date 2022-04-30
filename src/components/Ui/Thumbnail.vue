<script setup lang="ts">
import { getCDNImageUrl } from '@dodao/onboarding-schemas/helpers/getCDNImageUrl';
import { formatBytes32String } from '@ethersproject/strings';
import { getUrl } from '@snapshot-labs/snapshot.js/src/utils';
import { computed, ref } from 'vue';

const props = defineProps({
  big_tile: Boolean,
  size: String,
  src: {
    type: String
  },
  entityId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  imageClass: String
});

const error = ref(false);

const imgsrc = computed(() => {
  const url: string = getUrl(props.src);
  return getCDNImageUrl(url);
});

const address = computed(() => {
  if (props.entityId) return formatBytes32String(props.entityId.slice(0, 24));
  return '';
});

const bigTileStyle = {
  'object-fit': `${props.big_tile ? 'cover' : 'null'}`,
  'border-radius': `${props.big_tile ? 0 : 'null'}`,
  width: `${
    props.big_tile ? '100%' : (props.size && parseInt(props.size)) || 22
  }px`,
  height: `${
    props.big_tile ? '262' : (props.size && parseInt(props.size)) || 22
  }px`
};
</script>

<template v-if="src">
  <div class="flex justify-center" :class="{ 'w-[100%]': big_tile }">
    <img
      v-if="imgsrc && !error"
      :src="imgsrc"
      :style="bigTileStyle"
      @error="error = true"
      class="inline-block !align-middle leading-none rounded-lg"
      :class="imageClass"
      :alt="title"
    />
    <UiBlockie
      v-else-if="!!address"
      :seed="address"
      :style="bigTileStyle"
      class="inline-block !align-middle rounded-lg"
      :alt="title"
    />
  </div>
</template>
