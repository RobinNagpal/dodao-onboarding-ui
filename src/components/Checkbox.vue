<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  class: String
});

const emit = defineEmits(['update:modelValue']);

const input = ref<boolean | undefined>(props.modelValue || undefined);

watch(input, () => emit('update:modelValue', input.value));

function checkboxClicked() {
  input.value = !input.value;
}
</script>

<template>
  <div class="p-2 checkmark-container mr-2 flex-shrink-0">
    <input type="checkbox" v-model="input" :checked="props.modelValue" />
    <span
      class="checkmark"
      @click="checkboxClicked"
      :class="[{ [props.class]: props.modelValue }, { checked: props.modelValue }]"
    ></span>
  </div>
</template>
<style scoped lang="scss">
.checkmark-container {
  display: block;
  position: relative;
  height: 22px;
  width: 22px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    &:checked {
      ~ {
        .checkmark {
          @apply bg-primary;
          &:after {
            display: block;
          }
        }
      }
    }
  }
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
    border: solid 3px;
    border-color: var(--border-color);

    &.checked {
      border-color: var(--primary-color);
    }
    &:after {
      left: 4px;
      top: -2px;
      width: 8px;
      height: 17px;
      border: solid white;
      border-width: 0 3px 3px 0;
      transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      content: '';
      position: absolute;
      display: none;
    }
  }
}
</style>
