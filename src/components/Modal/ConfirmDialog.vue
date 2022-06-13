<script setup>
import { ref, defineExpose } from 'vue';
const open = ref(false);
const titleRef = ref('');
const msgRef = ref('');
const okTxtRef = ref('OK');
const cancelTxtRef = ref('Cancel');
const resolvePromise = ref();

const handleBtnClick = value => {
  open.value = false;
  resolvePromise.value(value);
};

defineExpose({
  show: ({ title, msg, okTxt = 'OK', cancelTxt = 'Cancel' }) => {
    titleRef.value = title;
    msgRef.value = msg;
    okTxtRef.value = okTxt;
    cancelTxtRef.value = cancelTxt;

    open.value = true;

    return new Promise(resolve => {
      resolvePromise.value = resolve;
    });
  }
});
</script>

<template>
  <UiModal :open="open" @close="handleBtnClick(false)" class="flex">
    <template v-slot:header>
      <h3>{{ titleRef }}</h3>
    </template>
    <div class="flex flex-col flex-auto my-2 mx-2">
      {{ msgRef }}
    </div>
    <template v-slot:footer>
      <div class="flex justify-around">
        <UiButton variant="contained" primary @click="handleBtnClick(true)">{{ okTxtRef }}</UiButton>
        <UiButton @click="handleBtnClick(false)">{{ cancelTxtRef }}</UiButton>
      </div>
    </template>
  </UiModal>
</template>
