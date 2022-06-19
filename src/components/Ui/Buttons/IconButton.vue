<script setup lang="ts">
import { IconTypes } from '@/components/Ui/Icons/IconTypes';
import DeleteIcon from '@/components/Ui/Icons/DeleteIcon.vue';
import { PropType } from 'vue';

defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  iconName: {
    type: String as PropType<IconTypes>,
    required: true
  }
});
</script>
<template>
  <button class="w-[44px] h-[44px] rounded-full flex justify-center items-center button" :disabled="disabled">
    <template v-if="iconName === IconTypes.Trash">
      <DeleteIcon />
    </template>
  </button>
</template>

<style scoped lang="scss">
.button {
  background-color: transparent;
  color: black;
  outline: none;

  &.button--active {
    border-color: var(--link-color) !important;
  }

  &:not(:disabled):hover {
    background-color: var(--header-bg);
  }

  &:disabled {
    color: var(--border-color) !important;
    cursor: not-allowed;
  }
}
</style>
