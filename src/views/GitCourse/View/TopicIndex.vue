<script setup lang="ts">
import { marked } from 'marked';
import { computed } from 'vue';
import Button from '@/components/Ui/Button.vue';

const props = defineProps({
  course: Object,
  topicKey: {
    type: String,
    required: true
  }
});

const currentTopicIndex = computed(() => {
  return (props.course?.topics || []).findIndex(topic => topic.key === props.topicKey);
});

const topic = computed(() => {
  if (currentTopicIndex.value === -1) return null;
  const topic = props.course?.topics[currentTopicIndex.value];
  return topic;
});

const renderer = new marked.Renderer();

const details = computed(() => {
  return marked.parse(topic.value?.details, { renderer });
});
</script>

<template>
  <div>
    <div class="flex">
      <div class="right">
        <h1 class="text-3xl mb-4">{{ topic?.title }}</h1>
        <p v-html="details" class="markdown-body"></p>
      </div>
    </div>

    <div class="flex flex-between mt-4 flex-1 items-end p-2">
      <router-link
        v-if="currentTopicIndex === 0"
        :to="{
          name: 'courseIndex'
        }"
      >
        <Button primary variant="contained">
          <span class="mr-2 font-bold">&#8592;</span>
          Previous
        </Button>
      </router-link>
      <div class="flex-1"></div>
      <router-link
        v-if="topic.readings.length > 0"
        :to="{
          name: 'courseReading',
          params: {
            uuid: topic.readings[0].uuid
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

<style lang="scss" scoped>
.right {
  min-height: 300px;
}
</style>
