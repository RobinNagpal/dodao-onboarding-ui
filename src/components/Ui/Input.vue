<script setup>
import { ref } from 'vue';

const isFocus = ref(false);

const props = defineProps({
  modelValue: [String, Number],
  placeholder: String,
  error: [String, Boolean],
  number: Boolean,
  disabled: Boolean,
  maxlength: [Number, String],
  additionalInputClass: String,
  required: {
    type: Boolean,
    default: true
  },
  hideBorder: Boolean
});

const emit = defineEmits(['update:modelValue']);

function handleInput(e) {
  const input = e.target.value;
  if (props.number) {
    return emit('update:modelValue', !input ? undefined : parseFloat(input));
  }
  emit('update:modelValue', input);
}
</script>

<template>
  <div
    :class="{
      '!border-red': error,
      'cursor-pointer': $slots.selected,
      'hover:border-skin-link': !disabled,
      'pt-3 mb-3 border-b border-skin-border transition-colors bg-transparent text-skin-link outline-none text-left w-full flex pr-3 focus-within:border-skin-link': true
    }"
  >
    <div
      v-if="$slots.selected"
      class="slot-selected flex-auto whitespace-nowrap overflow-x-auto"
    >
      <slot name="selected" />
    </div>
    <input
      v-else
      :value="modelValue"
      @input="handleInput"
      :placeholder="isFocus ? placeholder : modelValue || ''"
      :type="number ? 'number' : 'text'"
      :disabled="disabled"
      class="input flex-auto w-full"
      :class="additionalInputClass"
      :required="required"
      :maxlength="maxlength"
      @focus="isFocus = true"
      @blur="isFocus = false"
    />
    <div
      class="input-label text-color mr-2 whitespace-nowrap absolute"
      :class="modelValue && 'forceFloat'"
    >
      <slot name="label" />
    </div>
    <slot name="info" />
    <span
      v-if="error"
      v-tippy="{
        content: error
      }"
      class="float-right link-color"
    >
      <Icon name="warning" class="!text-red p-1 block pt-2 mt-[6px] -mr-1" />
    </span>
  </div>
</template>

<style scoped lang="scss">
.input-label {
  z-index: -1;
}
.slot-selected ~ .input-label,
input:focus ~ .input-label,
.forceFloat {
  transform: translatey(-18px);
  @apply text-xs;
  transition: transform 0.1s linear, font-size 0.1s linear;
}
</style>
