<template>
  <div>
    <div class="flex">
      <div class="right">
        <h1 class="text-3xl mb-4">Question {{ computedQuestionIndex + 1 }}</h1>
        <Question :questionResponse="[]" :question="currentQuestion"></Question>
      </div>
    </div>
    <div class="flex flex-between mt-6">
      <router-link
        v-if="computedQuestionIndex > 0"
        :to="{
          name: 'courseEvaluation',
          params: {
            questionIndex: computedQuestionIndex - 1
          }
        }"
      >
        <Button>
          <span class="mr-2 font-bold">&#8592;</span>

          Previous
        </Button>
      </router-link>
      <div class="flex-1"></div>
      <router-link
        v-if="computedQuestionIndex < topic.questions.length - 1"
        :to="{
          name: 'courseEvaluation',
          params: {
            questionIndex: computedQuestionIndex + 1
          }
        }"
      >
        <Button primary variant="contained">
          Next
          <span class="ml-2 font-bold">&#8594;</span>
        </Button>
      </router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import Button from '@/components/Ui/Button.vue';
import Question from '@/components/Guide/View/Question.vue';

const props = defineProps({
  course: Object,
  topicKey: {
    type: String,
    required: true
  },
  questionIndex: {
    type: Number,
    required: true,
    default: 0
  }
});

const topic = computed(() => {
  const topic = props.course?.topics.find(topic => topic.key === props.topicKey);
  return topic;
});
const currentQuestion = computed<any>(() => {
  return topic.value.questions[props.questionIndex];
});

const computedQuestionIndex = computed(() => {
  return +props.questionIndex;
});
</script>
<style lang="scss" scoped>
.right {
  min-height: 300px;
}
</style>
