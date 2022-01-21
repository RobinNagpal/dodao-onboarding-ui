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
      <Block :title="$t('create.choices')">
        <template v-for="choice in question.choices" :key="choice.key">
          <UiInput
            :modelValue="choice.content"
            maxlength="64"
            additionalInputClass="text-center"
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
        </template>
        <UiButton
          v-if="!disableChoiceEdit"
          @click="addChoice(1)"
          class="block w-full"
        >
          {{ $t('create.addChoice') }}
        </UiButton>
      </Block>
    </template>
  </div>
</template>
<style scoped lang="scss"></style>
