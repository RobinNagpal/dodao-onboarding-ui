<script setup lang="ts">
import { GuideSubmissionsQuery_guideSubmissions } from '@/graphql/generated/graphqlDocs';
import { PropType } from 'vue';
import { formatDate } from '@/utils/date/dateFormatUtils';

defineProps({
  submission: {
    type: Object as PropType<GuideSubmissionsQuery_guideSubmissions>
  }
});
</script>

<template>
  <div role="listitem" class="card border-2 border-gray-400 my-4 p-4">
    <div>{{ submission.createdBy }}</div>
    <div
      v-text="
        `Result - ${submission.result.correctQuestions.length}/${submission.result.allQuestions.length}`
      "
    />
    <div>{{ formatDate(new Date(submission.created * 1000)) }}</div>
  </div>
</template>
