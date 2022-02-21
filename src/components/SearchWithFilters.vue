<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

defineEmits(['update:modelValue']);

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const searchOptions = computed(() => [
  {
    text: t('dao'),
    action: 'home'
  }
]);

const searchSelectedOption = computed(
  () =>
    searchOptions.value.find(option => option.action === route.name)?.text ||
    'home'
);

const routeQuery = computed(() => route.query.q);

function redirectSearch(e) {
  router.push({
    name: e,
    query: routeQuery.value ? { q: routeQuery.value } : {}
  });
}
</script>

<template>
  <div class="flex">
    <Search
      :modelValue="routeQuery"
      @update:modelValue="input => $emit('update:modelValue', input)"
      :placeholder="$t('searchPlaceholder')"
      class="flex-auto pr-2"
    />
  </div>
</template>
