<script setup lang="ts">
import Checkbox from '@/components/Checkbox.vue';
import Radio from '@/components/Radio.vue';
import UiMarkdown from '@/components/Ui/Markdown.vue';
import {
  GuideQuestion,
  QuestionType
} from '@dodao/onboarding-schemas/models/GuideModel';
import { computed, PropType } from 'vue';
import isEqual from 'lodash/isEqual';

const props = defineProps({
  question: {
    type: Object as PropType<GuideQuestion>,
    required: true
  },
  questionResponse: {
    type: Array as PropType<string[]>,
    required: true
  }
});

const emit = defineEmits(['update:questionResponse']);

const currentlySelectedChoices = computed<string[]>(
  () => props.questionResponse || []
);

function selectMultipleChoice(choiceKey: string, selected: boolean) {
  const selectedAnswers = selected
    ? [...currentlySelectedChoices.value, choiceKey]
    : currentlySelectedChoices.value.filter(choice => choice !== choiceKey);

  emit('update:questionResponse', props.question.uuid, selectedAnswers);
}

function selectSingleChoice(choiceKey: string) {
  const selectedAnswers = isEqual(currentlySelectedChoices.value, [choiceKey])
    ? []
    : [choiceKey];

  emit('update:questionResponse', props.question.uuid, selectedAnswers);
}
</script>

<template>
  <div class="p-2 bg-skin-block-bg">
    <UiMarkdown :body="question.content" class="mb-2" />
    <template v-for="choice in question.choices" :key="choice.key">
      <div
        :class="{
          'flex leading-loose items-center':
            question.type === QuestionType.SingleChoice,
          'flex leading-loose items-center mb-3':
            question.type === QuestionType.MultipleChoice
        }"
      >
        <Radio
          v-if="question.type === QuestionType.SingleChoice"
          @update:modelValue="selectSingleChoice(choice.key)"
          :modelValue="currentlySelectedChoices.includes(choice.key)"
        />
        <Checkbox
          v-else
          @update:modelValue="selectMultipleChoice(choice.key, $event)"
          :modelValue="currentlySelectedChoices.includes(choice.key)"
        />
        <div class="leading-6">{{ choice.content }}</div>
      </div>
    </template>
  </div>
</template>
