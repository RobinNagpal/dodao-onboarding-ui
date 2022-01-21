<script setup>
import { ref } from 'vue';

const props = defineProps({
  step: Object
});

const emit = defineEmits(['update:step']);

const form = ref({
  name: '',
  body: ''
});

function inputError(field) {
  return false;
}

function updateStepName(name) {
  emit('update:step', { ...props.step, name });
}

function updateStepContent(content) {
  emit('update:step', { ...props.step, content });
}
</script>
<template>
  <div class="w-full border-l-2 p-4">
    <div class="h-40 mb-4" style="min-height: 40px">
      <UiSidebarButton class="float-right ml-2" :aria-label="$t('toggleSkin')">
        <Icon size="20" class="link-color" name="arrow-up" />
      </UiSidebarButton>
      <UiSidebarButton class="float-right ml-2" :aria-label="$t('toggleSkin')">
        <Icon size="20" class="link-color" name="arrow-down" />
      </UiSidebarButton>

      <UiSidebarButton class="float-right ml-2" :aria-label="$t('toggleSkin')">
        <Icon size="20" class="link-color" name="check1" />
      </UiSidebarButton>
    </div>
    <UiInput
      :modelValue="props.step.name"
      :error="inputError('name')"
      @update:modelValue="updateStepName"
    >
      <template v-slot:label>{{ $t(`guide.step.name`) }}*</template>
    </UiInput>
    <UiButton class="w-full h-96" style="height: max-content">
      <TextareaAutosize
        :value="props.step.content"
        :placeholder="$t(`guide.step.contents`)"
        class="input w-full text-left"
        style="font-size: 18px"
        @update:modelValue="updateStepContent"
      />
    </UiButton>
  </div>
</template>
<style scoped lang="scss"></style>
