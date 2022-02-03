<script setup>
import { ref } from 'vue';
import { onBeforeUpdate } from '@vue/runtime-core';

const props = defineProps({
  modelValue: Array
});

const emit = defineEmits(['update:modelValue']);

const input = ref(props.modelValue?.join('\n') || '');

onBeforeUpdate(() => {
  input.value = input.value || props.modelValue?.join('\n');
});

function updateModel(inputString) {
  const inputStrings = inputString
    .replace(/\n/g, ' ')
    .replace(/,/g, ' ')
    .replace(/;/g, ' ')
    .split(' ')
    .map(item => item.trim())
    .filter(item => !!item);
  emit('update:modelValue', inputStrings);
}
</script>

<template>
  <TextareaAutosize v-model="input" @update:modelValue="updateModel($event)" />
</template>
