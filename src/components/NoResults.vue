<script setup>
import { computed } from 'vue';
import i18n from '@/helpers/i18n';
const { t } = i18n.global;
defineProps(['block']);
const text = computed(() => t('noResultsFound'));
</script>

<template>
  <div class="mb-3 text-center">
    <Block v-if="block" class="pt-1">
      {{ text }}
    </Block>
    <div v-else>{{ text }}</div>
  </div>
</template>
