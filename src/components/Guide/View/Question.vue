<script setup lang="ts">
import { GuideQuestion } from '@/models/Guide';
import { PropType } from 'vue';

const props = defineProps({
  question: {
    type: Object as PropType<GuideQuestion>,
    required: true
  },
  selectAnswer: Function
});
</script>

<template>
  <div class="border md:rounded-lg p-4 mb-4 bg-skin-block-bg">
    <UiMarkdown :body="question.content" class="mb-6" />
    <template v-for="choice in question.choices" :key="choice.key">
      <div class="flex">
        <Checkbox
          @update:modelValue="selectAnswer(question.uuid, choice.key, $event)"
          :modelValue="question.answerKeys.includes(choice.key)"
        />
        {{ choice.content }}
      </div>
    </template>
  </div>
</template>
