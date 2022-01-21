<script setup>
const props = defineProps({
  addChoice: Function,
  question: Object,
  removeChoice: Function,
  updateStepContent: Function,
  updateAnswers: Function
});

const disableChoiceEdit = false;
</script>

<template>
  <div class="border md:rounded-lg p-4 mb-4 bg-skin-block-bg">
    <UiButton class="w-full h-96 mb-4" style="height: max-content">
      <TextareaAutosize
        :value="props.question.description"
        :placeholder="$t(`guide.step.contents`)"
        class="input w-full text-left"
        style="font-size: 18px"
        @update:modelValue="updateStepContent"
      />
    </UiButton>
    <template v-for="choice in props.question.choices" :key="choice.key">
      <div class="flex">
        <Checkbox
          @update:modelValue="
            updateAnswers(props.question.id, choice.key, $event)
          "
          :modelValue="props.question.answerKeys.includes(choice.key)"
        />
        <UiInput
          :modelValue="choice.content"
          maxlength="64"
          :disabled="disableChoiceEdit"
        >
          <template v-slot:info>
            <span
              v-if="!disableChoiceEdit"
              class="cursor-pointer"
              @click="removeChoice(props.question.id, choice.key)"
            >
              <Icon name="close" size="12" />
            </span>
          </template>
        </UiInput>
      </div>
    </template>
    <UiButton
      v-if="!disableChoiceEdit"
      @click="addChoice(props.question.id)"
      class="block w-full"
    >
      {{ $t('create.addChoice') }}
    </UiButton>
  </div>
</template>
