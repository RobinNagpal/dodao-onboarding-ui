<script setup lang="ts">
import { useCategories } from '@/composables/useCategories';

defineProps({
  open: Boolean,
  categories: Array
});

const { categories: spaceCategories } = useCategories();

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
    :categories="spaceCategories"
    :checkedCategories="categories"
    :open="open"
    @add="add"
    @close="close"
  />
</template>
