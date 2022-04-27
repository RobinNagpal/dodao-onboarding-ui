<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  class: String
});

const emit = defineEmits(['update:modelValue']);

const input = ref<boolean | undefined>(props.modelValue || undefined);

watch(input, () => emit('update:modelValue', input.value));

function radioSelected() {
  input.value = !input.value;
}
</script>

<template>
  <div class="p-2 radio-container flex-shrink-0" @click="radioSelected">
    <div
      class="overlay absolute top-0 rounded-full right-0 bottom-0 left-0 opacity-10 z-0"
    ></div>
    <input type="checkbox" v-model="input" :checked="props.modelValue" />
    <span class="checkmark" :class="props.class"></span>
  </div>
</template>
<style scoped lang="scss">
.radio-container {
  display: block;
  position: relative;
  padding: 4px;
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
          &:after {
            display: block;
          }
        }
      }
    }
  }
  .overlay {
    z-index: -1;
  }
  &:hover {
    .overlay {
      @apply bg-primary;
    }
  }
  .checkmark {
    &:after {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      @apply bg-primary;
    }
  }
}
.checkmark {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  width: 22px;
  margin: 6px;
  border-width: 3px;
  border-color: var(--border-color);
  border-radius: 50%;
  &:after {
    content: '';
    display: none;
  }
}
</style>
