<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useInfiniteLoader } from '@/composables/useInfiniteLoader';
import { useScrollMonitor } from '@/composables/useScrollMonitor';
import { useApolloQuery } from '@/composables/useApolloQuery';
import { GuidesQuery } from '@/graphql/guides.graphql';
import { useProfiles } from '@/composables/useProfiles';
import { useUnseenGuides } from '@/composables/useUnseenGuides';
import { lsSet, setPageTitle } from '@/helpers/utils';
import { useWeb3 } from '@/composables/useWeb3';
import { useStore } from '@/composables/useStore';

const props = defineProps({ space: Object, spaceId: String });

const { lastSeenGuides, updateLastSeenGuide } = useUnseenGuides();
const { web3Account } = useWeb3();
const { store } = useStore();

const loading = ref(false);

const spaceMembers = computed(() =>
  props.space.members.length < 1 ? ['none'] : props.space.members
);

const { loadBy, loadingMore, stopLoadingMore, loadMore } = useInfiniteLoader();

const { apolloQuery } = useApolloQuery();

async function loadGuides(skip = 0) {
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
}

function emitUpdateLastSeenGuide() {
  if (web3Account.value) {
    lsSet(
      `lastSeenGuides.${web3Account.value.slice(0, 8).toLowerCase()}`,
      Object.assign(lastSeenGuides.value, {
        [props.spaceId]: new Date().getTime()
      })
    );
  }
  updateLastSeenGuide(web3Account.value);
}

onMounted(() => {
  setPageTitle('page.title.space.guides', { space: props.space.name });
});

async function load() {
  if (store.space.guides.length > 0) return;
  loading.value = true;
  await loadGuides();
  loading.value = false;
  emitUpdateLastSeenGuide();
}

const { endElement } = useScrollMonitor(() =>
  loadMore(() => loadGuides(store.space.guides.length), loading.value)
);

const { profiles, loadProfiles } = useProfiles();

watch(store.space.guides, () => {
  loadProfiles(store.space.guides.map(guide => guide.author));
});

const guidesCount = computed(() => {
  const count = store.space.guides.length;
  return count ? count : 0;
});

const loadingData = computed(() => {
  return loading.value || loadingMore.value;
});
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
          <GuideTimelineGuide
            v-for="(guide, i) in store.space.guides"
            :key="i"
            :guide="guide"
            :profiles="profiles"
          />
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
