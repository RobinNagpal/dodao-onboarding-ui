<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useInfiniteLoader } from '@/composables/useInfiniteLoader';
import { useScrollMonitor } from '@/composables/useScrollMonitor';
import { useApolloQuery } from '@/composables/useApolloQuery';
import { GUIDES_QUERY } from '@/helpers/queries';
import { useProfiles } from '@/composables/useProfiles';
import { useUnseenGuides } from '@/composables/useUnseenGuides';
import { lsSet, setPageTitle } from '@/helpers/utils';
import { useWeb3 } from '@/composables/useWeb3';
import { useApp } from '@/composables/useApp';
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
      query: GUIDES_QUERY,
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
  store.space.guides = store.space.guides.concat(guidesObj);
  console.log('store.space.guides', store.space.guides);
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

function selectState(e) {
  store.space.filterBy = e;
  store.space.guides = [];
  load();
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
  <Layout>
    <template #sidebar-left>
      <BlockSpace :space="space" />
    </template>
    <template #content-right>
      <div class="px-4 md:px-0 mb-3 flex">
        <div class="flex-auto">
          <div v-text="space.name" />
          <div class="flex items-center flex-auto">
            <h2>{{ $t('guides.header') }}</h2>
          </div>
        </div>
        <UiDropdown
          top="3.5rem"
          right="1.25rem"
          @select="selectState"
          :items="[
            { text: $t('guides.states.all'), action: 'all' },
            { text: $t('guides.states.active'), action: 'active' },
            { text: $t('guides.states.pending'), action: 'pending' },
            { text: $t('guides.states.closed'), action: 'closed' },
            { text: $t('guides.states.core'), action: 'core' }
          ]"
        >
          <UiButton class="pr-3">
            {{ $t(`guides.states.${store.space.filterBy}`) }}
            <Icon size="14" name="arrow-down" class="mt-1 mr-1" />
          </UiButton>
        </UiDropdown>
      </div>

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
    </template>
  </Layout>
</template>
