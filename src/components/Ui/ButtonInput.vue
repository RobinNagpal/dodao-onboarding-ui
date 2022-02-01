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
  <UiButton
    class="flex w-full h-96 mb-4 px-[16px]"
    style="height: max-content"
    :class="{ '!border-red': error }"
  >
    <div
      v-if="$slots.selected"
      class="flex-auto whitespace-nowrap overflow-x-auto"
    >
      <slot name="selected" />
    </div>
    <input
      v-else
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      :type="number ? 'number' : 'text'"
      :disabled="disabled"
      class="input flex-auto w-full"
      :class="additionalInputClass"
      :required="required"
      :maxlength="maxlength"
    />
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
  </UiButton>
</template>
