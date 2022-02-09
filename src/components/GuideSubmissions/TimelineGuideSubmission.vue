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
  <div role="listitem" class="card">
    <div class="p-4 text-center">
      <h2 v-text="submission.createdBy" />
      <h2
        v-text="
          `Result - ${submission.result.correctQuestions}/${submission.result.allQuestions}`
        "
      />
    </div>
  </div>
</template>
