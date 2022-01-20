<script setup>
import { ref } from 'vue';

const form = ref({
  name: '',
  body: ''
});

function inputError(field) {
  return false;
}
</script>
<template>
  <div class="w-full border-l-2 p-4">
    <div class="h-40 mb-4" style="min-height: 40px">
      <UiSidebarButton class="float-right ml-2" :aria-label="$t('toggleSkin')">
        <Icon size="20" class="link-color" name="arrow-up" />
      </UiSidebarButton>
      <UiSidebarButton class="float-right ml-2" :aria-label="$t('toggleSkin')">
        <Icon size="20" class="link-color" name="arrow-down" />
      </UiSidebarButton>

      <UiSidebarButton class="float-right ml-2" :aria-label="$t('toggleSkin')">
        <Icon size="20" class="link-color" name="check1" />
      </UiSidebarButton>
    </div>
    <UiInput v-model="form.name" :error="inputError('name')">
      <template v-slot:label>{{ $t(`guide.step.name`) }}*</template>
    </UiInput>
    <UiButton class="w-full h-96" style="height: max-content">
      <TextareaAutosize
        v-model="form.body"
        :placeholder="$t(`guide.step.contents`)"
        class="input w-full text-left"
        style="font-size: 18px"
      />
    </UiButton>
  </div>
</template>
<style scoped lang="scss"></style>
