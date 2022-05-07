<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { setPageTitle } from '@/helpers/utils';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(() => {
  setPageTitle('page.title.home');

  const code = route.query?.code?.toString();
  const state = route.query?.state?.toString();
  const params = new URLSearchParams(decodeURIComponent(state!));

  router.push({
    name: 'spaceDiscord',
    params: { key: params.get('spaceId'), discordCode: code }
  });
});
</script>

<template>
  <LoadingSpinner />
</template>
