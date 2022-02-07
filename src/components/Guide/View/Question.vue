<script setup lang="ts">
import { GuideQuestion } from '@dodao/onboarding-schemas/models/GuideModel';
import { computed, onBeforeUpdate, PropType } from 'vue';

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

function selectChoice(choiceKey: string, selected: boolean) {
  console.log('selectChoice', currentlySelectedChoices, choiceKey, selected);

  const selectedAnswers = selected
    ? [...currentlySelectedChoices.value, choiceKey]
    : currentlySelectedChoices.value.filter(choice => choice !== choiceKey);

  emit('update:questionResponse', props.question.uuid, selectedAnswers);
}

onBeforeUpdate(() => {
  console.log('Question  - before update', props);
});
</script>

<template>
  <div class="border md:rounded-lg p-4 mb-4 bg-skin-block-bg">
    <UiMarkdown :body="question.content" class="mb-6" />
    <template v-for="choice in question.choices" :key="choice.key">
      <div class="flex leading-loose items-baseline">
        <Checkbox
          @update:modelValue="selectChoice(choice.key, $event)"
          :modelValue="currentlySelectedChoices.includes(choice.key)"
        />
        <div>{{ choice.content }}</div>
      </div>
    </template>
  </div>
</template>
