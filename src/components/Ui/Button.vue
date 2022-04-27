<script setup>
defineProps({
  primary: {
    type: Boolean,
    default: false
  },
  loading: Boolean,
  type: String,
  disabled: {
    type: Boolean,
    default: false
  },
  size: String
});
</script>

<template>
  <button
    :type="type || 'button'"
    :class="[
      { 'px-[16px] sm-button': size === 'sm' },
      'button px-[24px] focus-within:border-skin-link',
      { 'button--primary': primary }
    ]"
    :disabled="disabled || loading"
  >
    <UiLoading v-if="loading" :fill-white="primary" />
    <slot v-else />
  </button>
</template>

<style scoped lang="scss">
.button {
  border: 1px solid var(--border-color);
  background-color: transparent;
  color: var(--link-color);
  border-radius: 0.5rem;
  outline: none;
  line-height: 46px;
  height: 46px;
  font-size: 18px;

  &.sm-button {
    border-radius: 0.2rem;
    font-size: 14px;
    line-height: 26px;
    height: 28px;
  }

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
