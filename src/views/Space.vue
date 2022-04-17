<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDomain } from '@/composables/useDomain';
import { formatSpace } from '@/helpers/utils';
import { useExtendedSpaces } from '@/composables/useExtendedSpaces';

const route = useRoute();
const { domain } = useDomain();
const { loadExtentedSpaces, extentedSpaces, spaceLoading } =
  useExtendedSpaces();

const spaceId = computed(() => domain || route.params.key);

console.log('Space.vue - domain', domain);
const space = computed(() =>
  formatSpace(extentedSpaces.value?.find(s => s.id === spaceId.value))
);

console.log('Space.vue - route.path', route.path);
console.log('Space.vue - space', space.value);

const from = computed(() => route.params.from);
const spaceFrom = computed(() =>
  formatSpace(extentedSpaces.value?.find(s => s.id === from.value))
);

onMounted(() => loadExtentedSpaces([spaceId.value, from.value]));
</script>

<template>
  <router-view
    v-if="space"
    :spaceId="spaceId"
    :space="space"
    :from="from"
    :spaceFrom="spaceFrom"
    :spaceLoading="
      spaceLoading || spaceId !== space.id || !space?.extendedSpace
    "
    :loadExtentedSpaces="loadExtentedSpaces"
  />
</template>
