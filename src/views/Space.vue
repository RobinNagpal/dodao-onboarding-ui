<script setup>
import { computed, onMounted } from 'vue';
import { useApp } from '@/composables/useApp';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { formatSpace } from '@/helpers/utils';
import { useExtendedSpaces } from '@/composables/useExtendedSpaces';

const route = useRoute();
const router = useRouter();
const { explore } = useApp();
const { loadExtentedSpaces, extentedSpaces, spaceLoading } =
  useExtendedSpaces();


const spaceId = computed(() =>  route.params.key);
const space = computed(
  () =>
    formatSpace(extentedSpaces.value?.find(s => s.id === spaceId.value)) ??
    explore.value.spaces[spaceId.value]
);

const from = computed(() => route.params.from);
const spaceFrom = computed(() =>
  formatSpace(extentedSpaces.value?.find(s => s.id === from.value))
);

onMounted(() => loadExtentedSpaces([spaceId.value, from.value]));
</script>

<template>
  <router-view
    :spaceId="spaceId"
    :space="space"
    :from="from"
    :spaceFrom="spaceFrom"
    :spaceLoading="spaceLoading"
    :loadExtentedSpaces="loadExtentedSpaces"
  />
</template>
