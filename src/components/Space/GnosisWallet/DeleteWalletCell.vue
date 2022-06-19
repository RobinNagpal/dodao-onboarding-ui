<script setup lang="ts">
import IconButton from '@/components/Ui/Buttons/IconButton.vue';
import { IconTypes } from '@/components/Ui/Icons/IconTypes';

const props = defineProps({
  params: { type: Object, required: true }
});

console.log('data', props.params.data);
</script>

<template>
  <IconButton :icon-name="IconTypes.Trash"></IconButton>
</template>

<style scoped lang="scss"></style>
