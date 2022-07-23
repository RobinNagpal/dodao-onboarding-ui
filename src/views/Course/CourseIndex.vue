<script setup lang="ts">
import { marked } from 'marked';
import { computed } from 'vue';
import Button from '@/components/Ui/Button.vue';

const props = defineProps({
  course: Object
});

const renderer = new marked.Renderer();

const details = computed(() => {
  return marked.parse(props.course?.details, { renderer });
});
</script>

<template>
  <div>
    <div class="flex">
      <div class="right">
        <div class="font-bold mb-4">{{ course?.summary }}</div>
        <p v-html="details" class="markdown-body"></p>
      </div>
    </div>

    <div class="flex flex-between mt-4 flex-1 items-end p-2">
      <div class="flex-1"></div>
      <router-link
        v-if="course?.topics.length > 0"
        :to="{
          name: 'topicIndex',
          params: {
            topicKey: course?.topics[0].key
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
