<script setup lang="ts">
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed, PropType, ref } from 'vue';
import { getUrl } from '@snapshot-labs/snapshot.js/src/utils';
import { formatBytes32String } from '@ethersproject/strings';

const props = defineProps({
  big_tile: Boolean,
  size: String,
  space: {
    type: Object as PropType<SpaceModel>,
    required: true
  },
  symbolIndex: [String, Number]
});

const error = ref(false);

const spaceId = computed(() => props.space.id);

const imgsrc = computed(() => {
  const url = getUrl(props.space.avatar);
  if (!url) return '';
  return `https://worker.snapshot.org/mirror?img=${encodeURIComponent(url)}`;
});

const address = computed(() => {
  if (spaceId.value) return formatBytes32String(spaceId.value.slice(0, 24));
  return '';
});
</script>

<template>
  <spadivn class="flex justify-center mb-0" :class="{ 'w-[100%]': big_tile }">
    <img
      v-if="imgsrc && !error"
      :src="imgsrc"
      :style="{
        width: `${parseInt(size) || 22}px`,
        height: `${parseInt(size) || 22}px`
      }"
      @error="error = true"
      class="inline-block !align-middle leading-none"
      :class="[
        space?.skin ? `${space?.skin} bg-[color:var(--bg-color)]` : 'bg-white'
      ]"
      :alt="space?.name"
    />
    <UiBlockie
      v-else-if="!!address"
      :seed="address"
      :style="{
        'object-fit': `${big_tile ? 'cover' : 'null'}`,
        'border-radius': `${big_tile ? 0 : 'null'}`,
        width: `${big_tile ? '424' : parseInt(size) || 22}px`,
        height: `${big_tile ? '260' : parseInt(size) || 22}px`
      }"
      class="inline-block !align-middle rounded-full"
      :alt="space?.name"
    />
  </spadivn>
</template>
