<script setup lang="ts">
import { useWeb3 } from '@/composables/useWeb3';
import { useRoute } from 'vue-router';
import TreeView from '@/components/TreeView/TreeView.vue';
import TreeItem from '@/components/TreeView/TreeItem.vue';
import { ref } from 'vue';
import ChapterIcon from '@/components/Ui/Icons/ChapterIcon.vue';
import ReadingIcon from '@/components/Ui/Icons/ReadingIcon.vue';
import DiamondIcon from '@/components/Ui/Icons/DiamondIcon.vue';
import SummaryIcon from '@/components/Ui/Icons/SummaryIcon.vue';
import EvaluationIcon from '@/components/Ui/Icons/EvaluationIcon.vue';

const props = defineProps({
  course: Object
});
const route = useRoute();
const openChapter = ref(route.params.topicKey);

const handleToggle = (key, open) => {
  if (open === true) {
    openChapter.value = key;
  } else {
    openChapter.value = '';
  }
};
</script>
<template>
  <div class="p-4 min-h-auto md:min-h-full bg-skin-header-bg border border-skin-border">
    <ul class="nav-list" role="menu">
      <TreeView>
        <TreeItem
          class="absdfds"
          :open="openChapter === topic.key"
          @onToggle="handleToggle"
          :id="topic.key"
          :key="topic.key"
          v-for="topic in course?.topics"
        >
          <template v-slot:label>
            <router-link :to="{
              name: 'topicIndex',
              params: {
                topicKey: topic.key
              }
            }">
            <span class="mt-1 flex items-center">
              <span class="icon mr-2">
                <ChapterIcon></ChapterIcon>
              </span>
              {{ topic.title }}</span
            >
            </router-link>

          </template>

          <!-- reading section -->
          <TreeItem key="reading" :initialOpen="route.name === 'courseReading'">
            <template v-slot:label>
              <router-link
                class="text-skin-text"
                :to="{
                  name: 'courseReading',
                  params: {
                    topicKey: topic.key,
                    uuid: topic?.readings[0].uuid
                  }
                }"
              >
                <span class="mt-1 flex items-center">
                  <span class="icon mr-2">
                    <ReadingIcon></ReadingIcon>
                  </span>
                  Reading</span
                >
              </router-link>
            </template>
            <TreeItem
              :key="reading.uuid"
              v-for="reading in topic.readings"
              :class="{ selected: route.params.uuid === reading.uuid }"
            >
              <template v-slot:label>
                <router-link
                  class="text-skin-text"
                  :to="{
                    name: 'courseReading',
                    params: {
                      topicKey: topic.key,
                      uuid: reading.uuid
                    }
                  }"
                >
                  <span class="mt-1 flex items-center">
                    <span class="icon mr-2">
                      <DiamondIcon></DiamondIcon>
                    </span>
                    {{ reading.title }}</span
                  >
                </router-link>
              </template>
            </TreeItem>
          </TreeItem>

          <!-- summary section -->
          <TreeItem key="summary" :initialOpen="route.name === 'courseSummary'">
            <template v-slot:label>
              <router-link
                class="text-skin-text"
                :to="{
                  name: 'courseSummary',
                  params: {
                    topicKey: topic.key,
                    summaryKey: topic.summaries[0].key
                  }
                }"
              >
                <span class="mt-1 flex items-center">
                  <span class="icon mr-2">
                    <SummaryIcon></SummaryIcon>
                  </span>
                  Summary</span
                >
              </router-link>
            </template>
            <TreeItem
              :key="summary.key"
              v-for="summary in topic.summaries"
              :class="{ selected: route.params.summaryKey === summary.key }"
            >
              <template v-slot:label>
                <router-link
                  class="text-skin-text"
                  :to="{
                    name: 'courseSummary',
                    params: {
                      topicKey: topic.key,
                      summaryKey: summary.key
                    }
                  }"
                >
                  <span class="mt-1 flex items-center">
                    <span class="icon mr-2">
                      <DiamondIcon></DiamondIcon>
                    </span>
                    {{ summary.title }}</span
                  >
                </router-link>
              </template>
            </TreeItem>
          </TreeItem>

          <TreeItem
            :class="{ selected: route.name === 'courseEvaluation' }"
            key="evaluation"
            :initialOpen="route.name === 'courseEvaluation'"
          >
            <template v-slot:label>
              <router-link
                class="text-skin-text"
                :to="{
                  name: 'courseEvaluation',
                  params: {
                    topicKey: topic.key,
                    questionIndex: 0
                  }
                }"
              >
                <span class="mt-1 flex items-center">
                  <span class="icon mr-2">
                    <EvaluationIcon></EvaluationIcon>
                  </span>
                  Evaluations ({{ topic.questions.length }})</span
                >
              </router-link>
            </template>
          </TreeItem>
        </TreeItem>
      </TreeView>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.icon {
  display: flex;

  :deep(svg) {
    fill: var(--text-color);
    display: inline-block;
    height: 20px;
    width: 20px;
    line-height: 20px;
  }
}

.nav-item {
  @apply mb-2;
  color: var(--text-color);

  &.active {
    background: rgba(255, 255, 255, 0.2);
    @apply font-bold text-primary;

    .icon {
      svg {
        fill: var(--primary-color);
      }
    }
  }
}

.selected :deep(.itemLabel) {
  font-style: italic;
  font-weight: bold;
  text-decoration: underline;
}

.nav-list {
  margin-left: 0;
  list-style-type: none;
}
</style>
