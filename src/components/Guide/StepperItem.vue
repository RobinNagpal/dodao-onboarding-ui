<script setup>
import { computed, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

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

const questions = computed(() => {
  return props.step.questions;
});

const disableChoiceEdit = false;

function addChoice() {
  const key = uuidv4();
}

function removeChoice(key) {}
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
    <UiButtonInput
      :modelValue="props.step.name"
      :error="inputError('name')"
      @update:modelValue="updateStepName"
    >
      <template v-slot:label>{{ $t(`guide.step.name`) }}*</template>
    </UiButtonInput>
    <UiButton class="w-full h-96 mb-4" style="height: max-content">
      <TextareaAutosize
        :value="props.step.content"
        :placeholder="$t(`guide.step.contents`)"
        class="input w-full text-left"
        style="font-size: 18px"
        @update:modelValue="updateStepContent"
      />
    </UiButton>
    <template v-for="question in questions" :key="question.id">
      <div class="border md:rounded-lg p-4 mb-4 bg-skin-block-bg">
        <UiButton class="w-full h-96 mb-4" style="height: max-content">
          <TextareaAutosize
            :value="question.description"
            :placeholder="$t(`guide.step.contents`)"
            class="input w-full text-left"
            style="font-size: 18px"
            @update:modelValue="updateStepContent"
          />
        </UiButton>
        <template v-for="choice in question.choices" :key="choice.key">
          <div class="flex">
            <Checkbox />
            <UiInput
              :modelValue="choice.content"
              maxlength="64"
              :disabled="disableChoiceEdit"
            >
              <template v-slot:info>
                <span
                  v-if="!disableChoiceEdit"
                  class="cursor-pointer"
                  @click="removeChoice(choice.key)"
                >
                  <Icon name="close" size="12" />
                </span>
              </template>
            </UiInput>
          </div>
        </template>
        <UiButton
          v-if="!disableChoiceEdit"
          @click="addChoice(1)"
          class="block w-full"
        >
          {{ $t('create.addChoice') }}
        </UiButton>
      </div>
    </template>
  </div>
</template>
<style scoped lang="scss"></style>
