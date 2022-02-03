<script setup lang="ts">
import guideCategories from '@/helpers/guideCategories.json';

const props = defineProps({
  open: Boolean,
  categories: Array
});

const emit = defineEmits(['add', 'close']);

function add($selectedCategories) {
  emit('add', $selectedCategories);
  emit('close');
}

function close() {
  emit('close');
}
</script>

<template>
  <ModalCategory
    :categories="guideCategories"
    :checkedCategories="categories"
    :open="open"
    @add="add"
    @close="close"
  />
</template>
