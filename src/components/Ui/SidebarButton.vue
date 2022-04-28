<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});
</script>
<template>
  <button
    class="w-[44px] h-[44px] rounded-full flex justify-center items-center button"
    :disabled="disabled"
  >
    <slot />
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
