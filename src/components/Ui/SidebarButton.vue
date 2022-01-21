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
    class="border w-[44px] h-[44px] rounded-lg flex justify-center items-center button"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.button {
  border: 1px solid var(--border-color);
  background-color: transparent;
  color: var(--link-color);
  border-radius: 0.5rem;
  outline: none;

  &.button--active {
    border-color: var(--link-color) !important;
  }

  &:not(:disabled):hover {
    color: var(--link-color);
    border-color: var(--link-color);
  }

  &:disabled {
    color: var(--border-color) !important;
    cursor: not-allowed;
  }
}
</style>
