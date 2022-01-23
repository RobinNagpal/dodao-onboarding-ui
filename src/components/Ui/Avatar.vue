<script setup>
import { ref } from 'vue';

defineProps({
  address: String,
  size: String,
  imgsrc: String,
  space: Object
});

const error = ref(false);
</script>

<template>
  <span class="flex-shrink-0">
    <img
      v-if="imgsrc && !error"
      :src="imgsrc"
      :style="{
        width: `${parseInt(size) || 22}px`,
        height: `${parseInt(size) || 22}px`
      }"
      @error="error = true"
      :class="[
        space?.skin ? `${space?.skin} bg-[color:var(--bg-color)]` : 'bg-white'
      ]"
      :alt="space?.name"
      class="rounded-full inline-block !align-middle leading-none"
    />
    <UiBlockie
      v-else-if="!!address"
      :seed="address"
      class="inline-block !align-middle rounded-full"
      :style="{
        'line-height': 0,
        width: `${parseInt(size) || 22}px`,
        height: `${parseInt(size) || 22}px`
      }"
      :alt="space?.name"
    />
  </span>
</template>

<style scoped lang="scss">
.big_tile > span {
  width: 100%;
}
.big_tile img {
  width: 424px !important;
  height: 260px !important;
  object-fit: cover !important;
  border-radius: 0 !important;
}
</style>
