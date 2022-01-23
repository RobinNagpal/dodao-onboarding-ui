<script setup>
const props = defineProps({
  addChoice: Function,
  question: Object,
  removeChoice: Function,
  updateChoiceContent: Function,
  updateQuestionDescription: Function,
  updateAnswers: Function
});

const disableChoiceEdit = false;
</script>

<template>
  <div class="border md:rounded-lg p-4 mb-4 bg-skin-block-bg">
    <UiButton class="w-full h-96 mb-4" style="height: max-content">
      <TextareaAutosize
        :value="question.content"
        :placeholder="$t(`guide.question.content`)"
        class="input w-full text-left"
        style="font-size: 18px"
        @update:modelValue="updateQuestionDescription(question.id, $event)"
      />
    </UiButton>
    <template v-for="choice in question.choices" :key="choice.key">
      <div class="flex">
        <Checkbox
          @update:modelValue="updateAnswers(question.id, choice.key, $event)"
          :modelValue="question.answerKeys.includes(choice.key)"
        />
        <UiInput
          :modelValue="choice.content"
          maxlength="64"
          :disabled="disableChoiceEdit"
          @update:modelValue="
            updateChoiceContent(question.id, choice.key, $event)
          "
        >
          <template v-slot:info>
            <span
              v-if="!disableChoiceEdit && question.choices.length > 1"
              class="cursor-pointer"
              @click="removeChoice(question.id, choice.key)"
            >
              <Icon name="close" size="12" />
            </span>
          </template>
        </UiInput>
      </div>
    </template>
    <UiButton
      v-if="!disableChoiceEdit"
      @click="addChoice(question.id)"
      class="block w-full"
    >
      {{ $t('create.addChoice') }}
    </UiButton>
  </div>
</template>
