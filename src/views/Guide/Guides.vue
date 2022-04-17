<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import LayoutTopAndBottom from '@/components/Layout/TopAndBottom.vue';
import BlockSpaceNew from '@/components/Block/SpaceNew.vue';
import NoResults from '@/components/NoResults.vue';
import GuideNoGuides from '@/components/Guide/NoGuides.vue';
import GuideTimelineGuide from '@/components/Guide/TimelineGuide.vue';
import Block from '@/components/Block.vue';
import RowLoading from '@/components/RowLoading.vue';
import { useInfiniteLoader } from '@/composables/useInfiniteLoader';
import { useApolloQuery } from '@/composables/useApolloQuery';
import { GuidesQuery } from '@/graphql/guides.graphql';
import { useProfiles } from '@/composables/useProfiles';
import { setPageTitle } from '@/helpers/utils';
import { useStore } from '@/composables/useStore';

const props = defineProps({
  space: Object,
  spaceId: String,
  spaceLoading: Boolean
});

const { store } = useStore();

const loading = ref(false);

const spaceMembers = computed(() =>
  props.space.members.length < 1 ? ['none'] : props.space.members
);

const { loadBy, loadingMore, stopLoadingMore } = useInfiniteLoader();

const { apolloQuery } = useApolloQuery();

async function loadGuides(skip = 0) {
  loading.value = true;
  const guidesObj = await apolloQuery(
    {
      query: GuidesQuery,
      variables: {
        first: loadBy,
        skip,
        space: props.spaceId,
        state: store.space.filterBy === 'core' ? 'all' : store.space.filterBy,
        author_in: store.space.filterBy === 'core' ? spaceMembers.value : []
      }
    },
    'guides'
  );
  stopLoadingMore.value = guidesObj?.length < loadBy;
  store.space.guides = guidesObj;
  loading.value = false;
}

onMounted(() => {
  store.space.guides = [];
  setPageTitle('page.title.dao.guides', { dao: props.space.name });
  loadGuides(store.space.guides.length);
});

const { profiles, loadProfiles } = useProfiles();

watch(store.space.guides, () => {
  loadProfiles(store.space.guides.map(guide => guide.author));
});

const guidesCount = computed(() => {
  const count = store.space.guides.length;
  return count ? count : 0;
});

const loadingData = computed(() => {
  return loading.value || loadingMore.value || props.spaceLoading.value;
});

console.log('store.space', store.space);
</script>

<template>
  <LayoutTopAndBottom>
    <template #top-content>
      <BlockSpaceNew :space="space" />
    </template>
    <template #content-bottom>
      <div class="mt-6">
        <NoResults
          :block="true"
          v-if="!loadingData && guidesCount && store.space.guides.length < 1"
        />
        <GuideNoGuides
          v-else-if="!guidesCount && !loadingData"
          class="mt-2"
          :space="space"
        />
        <div v-else>
          <div v-if="!loadingData" class="_3-column-grid features-grid">
            <GuideTimelineGuide
              v-for="(guide, i) in store.space.guides"
              :key="i"
              :guide="guide"
              :profiles="profiles"
            />
          </div>
        </div>
        <div
          style="height: 10px; width: 10px; position: absolute"
          ref="endElement"
        />
        <Block v-if="loadingData" :slim="true">
          <RowLoading class="my-2" />
        </Block>
      </div>
    </template>
  </LayoutTopAndBottom>
</template>
