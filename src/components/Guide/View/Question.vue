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
  <div class="border md:rounded-lg p-4 mb-4 bg-skin-block-bg">
    <UiMarkdown :body="question.content" class="mb-6" />
    <template v-for="choice in question.choices" :key="choice.key">
      <div class="flex leading-loose items-baseline">
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
        <div>{{ choice.content }}</div>
      </div>
    </template>
  </div>
</template>
