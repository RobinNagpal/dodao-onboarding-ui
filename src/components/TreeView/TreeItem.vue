<script setup lang="ts">
import { on } from 'events';
import { Comment, computed, ref, useSlots } from 'vue';
const props = defineProps({
  id: {
    type: String || Number
  },
  open: {
    type: Boolean,
    default: null
  },
  initialOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['onToggle']);

const slots = useSlots();
const hasSlot = computed(() => slots.default && slots.default().findIndex(o => o.type !== Comment) !== -1);
const collapse = ref(!props.initialOpen);
function handleClick() {
  if (props.open === null) {
    collapse.value = !collapse.value;
    emit('onToggle', props.id, collapse.value);
  } else {
    emit('onToggle', props.id, !props.open);
  }
}
</script>
<template>
  <li class="treeItem">
    <div class="itemContent" @click="handleClick" :class="[{ 'border-b': hasSlot }]">
      <div class="itemLabel"><slot name="label"></slot></div>
      <div class="iconContainer" :class="{iconCollapse: open !== true && collapse }">
        <span v-if="hasSlot"></span>
      </div>
    </div>
    <template v-if="hasSlot">
      <ul class="treeItemGroup" :class="{ collapse: open !== true && collapse }">
        <div class="collapseWrapper">
          <div class="w-full">
            <slot></slot>
          </div>
        </div>
      </ul>
    </template>
  </li>
</template>
