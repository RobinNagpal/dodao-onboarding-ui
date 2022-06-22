<script setup lang="ts">
import IconButton from '@/components/Ui/Buttons/IconButton.vue';
import { IconTypes } from '@/components/Ui/Icons/IconTypes';

const props = defineProps({
  params: { type: Object, required: true }
});
</script>

<template>
  <IconButton @click="params.handleDeleteWallet(props.params.data)" :icon-name="IconTypes.Trash"></IconButton>
</template>
