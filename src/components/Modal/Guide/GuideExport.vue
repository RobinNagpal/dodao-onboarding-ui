<script setup lang="ts">
import UiMarkdown from '@/components/Ui/Markdown.vue';
import UiModal from '@/components/Ui/Modal.vue';
import { useCopy } from '@/composables/useCopy';
import { GuideQuery_guide } from '@/graphql/generated/graphqlDocs';
import { PropType, toRefs } from 'vue';

const props = defineProps({
  guide: { type: Object as PropType<GuideQuery_guide>, required: true },
  open: { type: Boolean, required: true }
});

const emit = defineEmits(['close']);

const { open } = toRefs(props);
const { copyToClipboard } = useCopy();

const guideJsonString = JSON.stringify(
  { ...props.guide, steps: props.guide.steps.slice(0, -1) },
  null,
  2
);
const guideJson = '\n``` \n' + guideJsonString + '\n ``` \n';
function copyGuideJson() {
  copyToClipboard(guideJsonString);
}
</script>

<template>
  <UiModal :open="open" @close="$emit('close')" :shell-class="'shell-max'">
    <template v-slot:header>
      <h3>Guide JSON</h3>
    </template>
    <div>
      <div class="m-4 space-y-2">
        <UiMarkdown
          :body="guideJson"
          class="p-4 h-[600px]"
          @click="copyGuideJson()"
        />
      </div>
    </div>
  </UiModal>
</template>
<style lang="scss">
.shell-max {
  min-width: 880px !important;
  min-height: 950px !important;
  .modal-body {
    min-height: 800px;
  }
}
</style>
