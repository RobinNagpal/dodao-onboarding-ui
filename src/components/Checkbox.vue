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
  <div class="p-2 checkmark-container mr-2">
    <input type="checkbox" v-model="input" :checked="props.modelValue" />
    <span
      class="checkmark"
      @click="checkboxClicked"
      :class="props.class"
    ></span>
  </div>
</template>
<style scoped lang="scss">
.checkmark-container {
  display: block;
  position: relative;
  height: 25px;
  width: 25px;
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
    &:after {
      left: 10px;
      top: 6px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  }
}
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #eee;
  &:after {
    content: '';
    position: absolute;
    display: none;
  }
}
</style>
