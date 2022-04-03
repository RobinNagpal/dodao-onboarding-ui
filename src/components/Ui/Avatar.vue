<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  address: String,
  size: String,
  imgsrc: String,
  space: Object,
  big_tile: Boolean
});

const error = ref(false);

const avatarUrl = props.imgsrc?.includes('cloudflare-ipfs.com')
  ? props.imgsrc.replace(
      'cloudflare-ipfs.com/ipfs',
      'd31h13bdjwgzxs.cloudfront.net'
    )
  : props.imgsrc;
</script>

<template>
  <span class="flex-shrink-0" :class="{ 'w-[100%]': big_tile }">
    <img
      v-if="avatarUrl && !error"
      :src="avatarUrl"
      :style="{
        width: `${parseInt(size) || 22}px`,
        height: `${parseInt(size) || 22}px`
      }"
      @error="error = true"
      class="rounded-full inline-block !align-middle leading-none"
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
        width: `${big_tile ? '350' : parseInt(size) || 22}px`,
        height: `${big_tile ? '300' : parseInt(size) || 22}px`
      }"
      class="inline-block !align-middle rounded-full"
      :alt="space?.name"
    />
  </span>
</template>
