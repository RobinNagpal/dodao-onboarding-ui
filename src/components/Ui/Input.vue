<script setup>
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
  }
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
    class="border border-skin-border transition-colors bg-transparent text-skin-link rounded-lg outline-none leading-[46px] text-left w-full mb-2 flex px-3 focus-within:border-skin-link hover:border-skin-link"
    :class="{ '!border-red': error, 'cursor-pointer': $slots.selected }"
  >
    <UiPlainInput
      :modelValue="modelValue"
      :placeholder="placeholder"
      :error="error"
      :number="number"
      :disabled="disabled"
      :maxlength="maxlength"
      :additionalInputClass="additionalInputClass"
      :required="required"
    />
  </div>
</template>
