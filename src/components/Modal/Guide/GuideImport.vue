<script setup lang="ts">
import TextareaAutosize from '@/components/TextareaAutosize.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiModal from '@/components/Ui/Modal.vue';
import { ref, toRefs } from 'vue';

const props = defineProps({
  open: { type: Boolean, required: true },
  importGuide: { type: Function, required: true }
});

const emit = defineEmits(['close', 'importGuide']);

const { open } = toRefs(props);

const guideJson = ref(null);
</script>

<template>
  <UiModal :open="open" @close="$emit('close')" :shell-class="'shell-max'">
    <template v-slot:header>
      <h3>Guide JSON</h3>
    </template>

    <div class="m-4 space-y-2">
      <div class="border-2 rounded-lg">
        <TextareaAutosize
          :value="guideJson"
          :min-height="700"
          class="input w-full text-left p-2"
          style="font-size: 14px"
          @update:modelValue="guideJson = $event"
        />
      </div>
      <UiButton
        class="button-outline w-full flex justify-center items-center"
        :disabled="!guideJson?.trim()"
        @click="importGuide(JSON.parse(guideJson))"
      >
        Import
      </UiButton>
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
