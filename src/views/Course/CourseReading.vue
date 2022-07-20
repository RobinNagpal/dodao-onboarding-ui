<template>
  <div>
    <div class="flex">
      <div class="left mr-4 flex-shrink-0">
        <div class="iframe-container">
          <iframe class="responsive-iframe" :src="iframeUrl"></iframe>
        </div>
      </div>
      <div class="right">
        <h1 class="text-3xl">{{ currentReading.title }}</h1>
        <p v-html="details" class="markdown-body"></p>
      </div>
    </div>
    <div class="flex flex-between mt-6">
      <router-link
        v-if="currentReadingIndex > 0"
        :to="{
          name: 'courseReading',
          params: {
            uuid: topic.readings[currentReadingIndex - 1]?.uuid
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
        v-if="currentReadingIndex < topic.readings.length - 1"
        :to="{
          name: 'courseReading',
          params: {
            uuid: topic.readings[currentReadingIndex + 1]?.uuid
          }
        }"
      >
        <Button primary variant="contained">
          Next
          <span class="ml-2 font-bold">&#8594;</span>
        </Button>
      </router-link>
      <router-link
        v-if="currentReadingIndex === topic.readings.length - 1"
        :to="{
          name: 'courseSummary',
          params: {
            summaryKey: topic?.summaries[0]?.key
          }
        }"
      >
        <Button primary variant="contained">
          Summary
          <span class="ml-2 font-bold">&#8594;</span>
        </Button>
      </router-link>
    </div>
  </div>
</template>
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
  uuid: {
    type: String,
    required: true
  }
});

const topic = computed(() => {
  const topic = props.course?.topics.find(topic => topic.key === props.topicKey);
  return topic;
});
const currentReadingIndex = computed(() => {
  if (!topic.value) return null;
  return topic.value.readings.findIndex(reading => reading.uuid === props.uuid);
});
const currentReading = computed<any>(() => {
  if (currentReadingIndex.value === -1) return null;
  return topic.value.readings[currentReadingIndex.value];
});
const iframeUrl = computed(() => {
  const params = new URLSearchParams('?' + currentReading.value.url.split('?')[1]);
  return `https://www.youtube.com/embed/${params.get('v')}`;
});

const renderer = new marked.Renderer();

const details = computed(() => {
  return marked.parse(currentReading.value.details, { renderer });
});
</script>
<style lang="scss" scoped>
.right {
  min-height: 300px;
}
.left {
  width: 30%;
}
.iframe-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  // padding-top: 150%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */

  padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
}

/* Then style the iframe to fit in the container div with full height and width */
.responsive-iframe {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
</style>
