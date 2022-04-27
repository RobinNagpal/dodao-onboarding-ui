<script setup>
defineProps({
  primary: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'outlined',
    validator: (prop) => ['outlined', 'contained', 'text'].includes(prop)
  },
  loading: Boolean,
  type: String,
  disabled: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <button
    :type="type || 'button'"
    :class="[
      'inline-flex items-center justify-center button px-[24px]',
      { 'button--primary': primary },
      { 'button--outlined': variant === 'outlined' },
      { 'button--contained': variant === 'contained' },
      { 'button--text': variant === 'text' }
    ]"
    :disabled="disabled || loading"
  >
    <UiLoading v-if="loading" :fill-white="primary" />
    <slot v-else />
  </button>
</template>

<style scoped lang="scss">
.button {
  border: 1px solid;
  background-color: transparent;
  color: var(--link-color);
  border-radius: 0.5rem;
  outline: none;
  height: 46px;
  font-size: 18px;

  &.button--outlined {
    @apply border-skin-border;
    &.button--primary {
      @apply text-primary border border-primary;
    }
  }
  
  &.button--contained {
    &.button--primary {
      color: white;
      background-color: var(--primary-color);
      border: 1px solid var(--primary-color);

      &:hover {
        color: white;
        background-color: var(--primary-color);
        border: 1px solid var(--primary-color);
      }

      &:disabled {
        color: var(--link-color) !important;
        border: 1px solid var(--border-color);
        background-color: var(--border-color);
      }
    }
  }

  &.button--active {
    border-color: var(--link-color) !important;
  }

  &:hover {
    color: var(--link-color);
    border-color: var(--link-color);
  }

  &:disabled {
    color: var(--border-color) !important;
    cursor: not-allowed;
  }
}
</style>
