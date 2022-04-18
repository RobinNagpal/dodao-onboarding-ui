<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import LayoutTopAndBottom from '@/components/Layout/TopAndBottom.vue';
import BlockSpaceNew from '@/components/Block/SpaceNew.vue';
import NoResults from '@/components/NoResults.vue';
import GuideBundleNoGuideBundles from '@/components/GuideBundle/NoGuideBundles.vue';
import GuideBundleTimelineGuideBundle from '@/components/GuideBundle/TimelineGuideBundle.vue';
import Block from '@/components/Block.vue';
import RowLoading from '@/components/RowLoading.vue';
import { useInfiniteLoader } from '@/composables/useInfiniteLoader';
import { useApolloQuery } from '@/composables/useApolloQuery';
import { GuideBundlesQuery } from '@/graphql/guideBundles.graphql';
import { useProfiles } from '@/composables/useProfiles';
import { setPageTitle } from '@/helpers/utils';
import { useStore } from '@/composables/useStore';
import { useDomain } from '@/composables/useDomain';

const props = defineProps({
  space: Object,
  spaceId: String,
  spaceLoading: Boolean
});

const { store } = useStore();
const { domain } = useDomain();

const loading = ref(false);

const spaceMembers = computed(() =>
  props.space.members.length < 1 ? ['none'] : props.space.members
);

const { loadBy, loadingMore, stopLoadingMore } = useInfiniteLoader();

const { apolloQuery } = useApolloQuery();

async function loadGuideBundles(skip = 0) {
  loading.value = true;
  const guidesObj = await apolloQuery(
    {
      query: GuideBundlesQuery,
      variables: {
        first: loadBy,
        skip,
        space: props.spaceId,
        state: store.space.filterBy === 'core' ? 'all' : store.space.filterBy,
        author_in: store.space.filterBy === 'core' ? spaceMembers.value : []
      }
    },
    'guideBundles'
  );
  stopLoadingMore.value = guidesObj?.length < loadBy;
  store.space.guideBundles = guidesObj;
  loading.value = false;
}

onMounted(() => {
  store.space.guideBundles = [];
  setPageTitle('page.title.dao.bundle', { dao: props.space.name });
  loadGuideBundles(store.space.guideBundles.length);
});

const { profiles, loadProfiles } = useProfiles();

watch(store.space.guideBundles, () => {
  loadProfiles(store.space.guideBundles.map(guide => guide.author));
});

const guideBundlesCount = computed(() => {
  const count = store.space.guideBundles?.length;
  return count ? count : 0;
});

const loadingData = computed(() => {
  return loading.value || loadingMore.value || props.spaceLoading.value;
});
</script>

<template>
  <LayoutTopAndBottom>
    <template #top-content v-if="!domain">
      <BlockSpaceNew :space="space" />
    </template>
    <template #content-bottom>
      <div class="mt-6">
        <NoResults
          :block="true"
          v-if="
            !loadingData &&
            guideBundlesCount &&
            store.space.guideBundles.length < 1
          "
        />
        <GuideBundleNoGuideBundles
          v-else-if="!guideBundlesCount && !loadingData"
          class="mt-2"
          :space="space"
        />
        <div v-else>
          <div v-if="!loadingData" class="_3-column-grid features-grid">
            <GuideBundleTimelineGuideBundle
              v-for="(guide, i) in store.space.guideBundles"
              :key="i"
              :guide-bundle="guide"
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
