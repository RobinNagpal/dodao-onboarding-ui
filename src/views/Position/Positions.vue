<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import {useInfiniteLoader} from '@/composables/useInfiniteLoader';
import {useScrollMonitor} from '@/composables/useScrollMonitor';
import {useApolloQuery} from '@/composables/useApolloQuery';
import {POSITIONS_QUERY} from '@/helpers/queries';
import {useProfiles} from '@/composables/useProfiles';
import {useUnseenPositions} from '@/composables/useUnseenPositions';
import {lsSet, setPageTitle} from '@/helpers/utils';
import {useWeb3} from '@/composables/useWeb3';
import {useApp} from '@/composables/useApp';
import {useStore} from '@/composables/useStore';

const props = defineProps({ space: Object, spaceId: String });

const { lastSeenPositions, updateLastSeenPosition } = useUnseenPositions();
const { web3Account } = useWeb3();
const { store } = useStore();

const loading = ref(false);

const spaceMembers = computed(() =>
    props.space.members.length < 1 ? ['none'] : props.space.members
);

const { loadBy, loadingMore, stopLoadingMore, loadMore } = useInfiniteLoader();

const { apolloQuery } = useApolloQuery();

async function loadPositions(skip = 0) {
  const positionsObj = await apolloQuery(
      {
        query: POSITIONS_QUERY,
        variables: {
          first: loadBy,
          skip,
          space: props.spaceId,
          state: store.space.filterBy === 'core' ? 'all' : store.space.filterBy,
          author_in: store.space.filterBy === 'core' ? spaceMembers.value : []
        }
      },
      'positions'
  );
  stopLoadingMore.value = positionsObj?.length < loadBy;
  store.space.positions = store.space.positions.concat(positionsObj);
}

function emitUpdateLastSeenPosition() {
  if (web3Account.value) {
    lsSet(
        `lastSeenPositions.${web3Account.value.slice(0, 8).toLowerCase()}`,
        Object.assign(lastSeenPositions.value, {
          [props.spaceId]: new Date().getTime()
        })
    );
  }
  updateLastSeenPosition(web3Account.value);
}

onMounted(() => {
  setPageTitle('page.title.space.positions', { space: props.space.name });
});

async function load() {
  if (store.space.positions.length > 0) return;
  loading.value = true;
  await loadPositions();
  loading.value = false;
  emitUpdateLastSeenPosition();
}

watch(
    props.spaceId,
    () => {
      const firstPosition = store.space.positions[0]
      if (firstPosition && firstPosition?.space.id !== props.spaceId) {
        store.space.positions = [];
        load();
      }
    },
    { immediate: true }
);

function selectState(e) {
  store.space.filterBy = e;
  store.space.positions = [];
  load();
}

const { endElement } = useScrollMonitor(() =>
    loadMore(() => loadPositions(store.space.positions.length), loading.value)
);

const { profiles, loadProfiles } = useProfiles();

watch(store.space.positions, () => {
  loadProfiles(store.space.positions.map(position => position.author));
});

const { explore } = useApp();
const positionsCount = computed(() => {
  const count = explore.value.spaces[props.space.id].positions;
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
            <h2>{{ $t('positions.header') }}</h2>
          </div>
        </div>
        <UiDropdown
            top="3.5rem"
            right="1.25rem"
            @select="selectState"
            :items="[
            { text: $t('positions.states.all'), action: 'all' },
            { text: $t('positions.states.active'), action: 'active' },
            { text: $t('positions.states.pending'), action: 'pending' },
            { text: $t('positions.states.closed'), action: 'closed' },
            { text: $t('positions.states.core'), action: 'core' }
          ]"
        >
          <UiButton class="pr-3">
            {{ $t(`positions.states.${store.space.filterBy}`) }}
            <Icon size="14" name="arrow-down" class="mt-1 mr-1" />
          </UiButton>
        </UiDropdown>
      </div>

      <NoResults
          :block="true"
          v-if="
          !loadingData && positionsCount && store.space.positions.length < 1
        "
      />
      <PositionNoPositions
          v-else-if="!positionsCount && !loadingData"
          class="mt-2"
          :space="space"
      />
      <div v-else>
        <PositionTimelinePosition
            v-for="(position, i) in store.space.positions"
            :key="i"
            :position="position"
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
