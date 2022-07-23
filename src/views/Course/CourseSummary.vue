<script setup lang="ts">
import { marked } from 'marked';
import { computed } from 'vue';
import Button from '@/components/Ui/Button.vue';

const props = defineProps({
  course: Object,
  topicKey: {
    type: String,
    required: true
  },
  summaryKey: {
    type: String,
    required: true
  }
});

const topic = computed(() => {
  const topic = props.course?.topics.find(topic => topic.key === props.topicKey);
  return topic;
});
const currentSummaryIndex = computed(() => {
  if (!topic.value) return -1;
  return topic.value.summaries.findIndex(summary => summary.key === props.summaryKey);
});
const currentSummary = computed<any>(() => {
  if (currentSummary.value === -1) return null;
  return topic.value.summaries[currentSummaryIndex.value];
});

const renderer = new marked.Renderer();

const details = computed(() => {
  return marked.parse(currentSummary.value.details, { renderer });
});
</script>

<template>
  <div>
    <div class="flex">
      <div class="right">
        <h1 class="text-3xl mb-4">{{ currentSummary.title }}</h1>
        <p v-html="details" class="markdown-body"></p>
      </div>
    </div>
    <div class="flex flex-between mt-4 flex-1 items-end p-2">
      <router-link
        v-if="currentSummaryIndex > 0"
        :to="{
          name: 'courseSummary',
          params: {
            summaryKey: topic.summaries[currentSummaryIndex - 1]?.key
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
        v-if="currentSummaryIndex < topic.summaries.length - 1"
        :to="{
          name: 'courseSummary',
          params: {
            summaryKey: topic.summaries[currentSummaryIndex + 1]?.key
          }
        }"
      >
        <Button primary variant="contained">
          Next
          <span class="ml-2 font-bold">&#8594;</span>
        </Button>
      </router-link>
      <router-link
        v-if="currentSummaryIndex === topic.summaries.length - 1"
        :to="{
          name: 'courseEvaluation',
          params: {
            questionIndex: 0
          }
        }"
      >
        <Button primary variant="contained">
          Evaluation
          <span class="ml-2 font-bold">&#8594;</span>
        </Button>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.right {
  min-height: 300px;
}
</style>
