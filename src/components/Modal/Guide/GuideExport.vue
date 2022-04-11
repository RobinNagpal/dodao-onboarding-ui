<script setup lang="ts">
import UiMarkdown from '@/components/Ui/Markdown.vue';
import UiModal from '@/components/Ui/Modal.vue';
import { GuideQuery_guide } from '@/graphql/generated/graphqlDocs';
import { PropType, toRefs } from 'vue';

const props = defineProps({
  guide: { type: Object as PropType<GuideQuery_guide>, required: true },
  open: { type: Boolean, required: true }
});

const { open } = toRefs(props);

const guideJson =
  '\n``` \n' + JSON.stringify(props.guide, null, 2) + '\n ``` \n';
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template v-slot:header>
      <h3>Guide JSON</h3>
    </template>

    <div>
      <div class="m-4 space-y-2">
        <UiMarkdown :body="guideJson" class="p-4" />
      </div>
    </div>
  </UiModal>
</template>
