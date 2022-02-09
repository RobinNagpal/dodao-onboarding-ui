<script setup lang="ts">
import { GuideSubmissionsQuery_guideSubmissions } from '@/graphql/generated/graphqlDocs';
import { PropType } from 'vue';

defineProps({
  submission: {
    type: Object as PropType<GuideSubmissionsQuery_guideSubmissions>
  }
});
</script>

<template>
  <div role="listitem" class="card border-2 border-gray-400">
    <div class="p-4">
      <div>{{ submission.createdBy }}</div>
      <div
        v-text="
          `Result - ${submission.result.correctQuestions.length}/${submission.result.allQuestions.length}`
        "
      />
    </div>
  </div>
</template>
