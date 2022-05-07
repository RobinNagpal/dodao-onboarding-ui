<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDomain } from '@/composables/useDomain';
import { formatSpace } from '@/helpers/utils';
import { useExtendedSpaces } from '@/composables/useExtendedSpaces';

const route = useRoute();
const { domain } = useDomain();
const { loadExtendedSpace, loadExtentedSpaces, extentedSpaces, spaceLoading } =
  useExtendedSpaces();

const spaceId = computed(() => domain || route.params.key);

const space = computed(() =>
  formatSpace(extentedSpaces.value?.find(s => s.id === spaceId.value))
);

onMounted(() => loadExtendedSpace(spaceId.value));
</script>

<template>
  <router-view
    v-if="space"
    :spaceId="spaceId"
    :space="space"
    :spaceLoading="
      spaceLoading || spaceId !== space.id || !space?.extendedSpace
    "
    :loadExtentedSpaces="loadExtentedSpaces"
  />
</template>
