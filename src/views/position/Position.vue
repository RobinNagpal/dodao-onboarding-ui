<script setup>
import { ref, computed, watch, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  getPosition,
  getPower,
} from '@/helpers/snapshot';
import { setPageTitle, explorerUrl, ms, n, getIpfsUrl } from '@/helpers/utils';
import { useModal } from '@/composables/useModal';
import { useTerms } from '@/composables/useTerms';
import { useProfiles } from '@/composables/useProfiles';
import { useDomain } from '@/composables/useDomain';
import { useSharing } from '@/composables/useSharing';
import { useWeb3 } from '@/composables/useWeb3';
import { useClient } from '@/composables/useClient';
import { useApp } from '@/composables/useApp';
import { useInfiniteLoader } from '@/composables/useInfiniteLoader';
import { useStore } from '@/composables/useStore';

const props = defineProps({
  spaceId: String,
  space: Object,
  spaceLoading: Boolean
});

const route = useRoute();
const router = useRouter();
const { domain } = useDomain();
const { t } = useI18n();
const { web3, web3Account } = useWeb3();
const { send, clientLoading } = useClient();
const { getExplore } = useApp();
const { store } = useStore();
const notify = inject('notify');

const id = route.params.id;

const modalOpen = ref(false);
const loading = ref(true);
const position = ref({});
const results = ref({});
const totalScore = ref(0);
const scores = ref([]);

const isCreator = computed(() => position.value.author === web3Account.value);
const loaded = computed(() => !props.spaceLoading && !loading.value);
const isAdmin = computed(() => {
  const admins = (props.space.admins || []).map(admin => admin.toLowerCase());
  return admins.includes(web3Account.value?.toLowerCase());
});
const threeDotItems = computed(() => {
  const items = [{ text: t('duplicatePosition'), action: 'duplicate' }];
  if (isAdmin.value || isCreator.value)
    items.push({ text: t('deletePosition'), action: 'delete' });
  return items;
});

const browserHasHistory = computed(() => window.history.state.back);

const { modalAccountOpen } = useModal();
const { modalTermsOpen, termsAccepted, acceptTerms } = useTerms(props.spaceId);


async function loadPosition() {
  position.value = await getPosition(id);
  // Redirect to position spaceId if it doesn't match route key
  if (
    route.name === 'spacePosition' &&
    props.spaceId !== position.value.space.id
  ) {
    router.push({ name: 'error-404' });
  }

  loading.value = false;
  if (loaded.value) loadResults();
}


async function loadResults() {}

const { loadBy, loadingMore, loadMore } = useInfiniteLoader(10);

async function loadPower() {
  if (
    !web3Account.value ||
    !position.value.author ||
    position.value.state === 'closed'
  )
    return;
  const response = await getPower(
    props.space,
    web3Account.value,
    position.value
  );
  totalScore.value = response.totalScore;
  scores.value = response.scores;
}

async function deletePosition() {
  const result = await send(props.space, 'delete-position', {
    position: position.value
  });
  console.log('Result', result);
  if (result.id) {
    getExplore();
    store.space.positions = [];
    notify(['green', t('notify.positionDeleted')]);
    router.push({ name: 'spacePositions' });
  }
}

const {
  shareToTwitter,
  shareToFacebook,
  shareToClipboard,
  startShare,
  sharingIsSupported,
  sharingItems
} = useSharing();

function selectFromThreedotDropdown(e) {
  if (e === 'delete') deletePosition();
  if (e === 'duplicate')
    router.push({
      name: 'spaceCreate',
      params: {
        key: position.value.space.id,
        from: position.value.id
      }
    });
}

function selectFromShareDropdown(e) {
  if (e === 'shareToTwitter')
    shareToTwitter(props.space, position.value, window);
  else if (e === 'shareToFacebook')
    shareToFacebook(props.space, position.value, window);
  else if (e === 'shareToClipboard')
    shareToClipboard(props.space, position.value);
}

const { profiles, loadProfiles } = useProfiles();

watch(position, () => {
  loadProfiles([position.value.author]);
});

watch(web3Account, (val, prev) => {
  if (val?.toLowerCase() !== prev) loadPower();
});

watch([loaded, web3Account], () => {
  if (web3.value.authLoading && !web3Account.value) return;
  if (!loaded.value) return;
  loadResults();
  loadPower();
});

onMounted(async () => {
  await loadPosition();
  setPageTitle('page.title.space.position', {
    position: position.value.title,
    space: props.space.name
  });
});
</script>

<template>
  <Layout v-bind="$attrs">
    <template #content-left>
      <div class="px-4 md:px-0 mb-3">
        <a
          class="text-color"
          @click="
            browserHasHistory
              ? $router.go(-1)
              : $router.push(
                  domain ? { path: '/' } : { name: 'spacePositions' }
                )
          "
        >
          <Icon name="back" size="22" class="!align-middle" />
          {{ browserHasHistory ? $t('back') : space.name }}
        </a>
      </div>
      <div class="px-4 md:px-0">
        <template v-if="loaded">
          <h1 v-text="position.title" class="mb-2" />
          <div class="mb-4">
            <UiState :state="position.state" class="inline-block" />
            <UiDropdown
              top="2.5rem"
              right="1.5rem"
              class="float-right mr-2"
              @select="selectFromShareDropdown"
              @clickedNoDropdown="startShare(space, position)"
              :items="sharingItems"
              :hideDropdown="sharingIsSupported"
            >
              <div class="pr-1 select-none">
                <Icon name="upload" size="25" class="!align-text-bottom" />
                Share
              </div>
            </UiDropdown>
            <UiDropdown
              top="2.5rem"
              right="1.3rem"
              class="float-right mr-2"
              @select="selectFromThreedotDropdown"
              :items="threeDotItems"
            >
              <div class="pr-3">
                <UiLoading v-if="clientLoading" />
                <Icon v-else name="threedots" size="25" />
              </div>
            </UiDropdown>
          </div>
          <UiMarkdown :body="position.body" class="mb-6" />
        </template>
        <PageLoading v-else />
      </div>
    </template>
    <template #sidebar-right v-if="loaded">
      <Block :title="$t('information')">
        <div class="space-y-1">
          <div>
            <b>{{ $t('author') }}</b>
            <User
              :address="position.author"
              :profile="profiles[position.author]"
              :space="space"
              :position="position"
              class="float-right"
            />
          </div>
          <div>
            <b>IPFS</b>
            <a
              :href="getIpfsUrl(position.ipfs)"
              target="_blank"
              class="float-right"
            >
              #{{ position.ipfs.slice(0, 7) }}
              <Icon name="external-link" class="ml-1" />
            </a>
          </div>
          <div>
            <b>{{ $t('position.votingSystem') }}</b>
            <span class="float-right link-color">
              {{ $t(`voting.${position.type}`) }}
            </span>
          </div>
          <div>
            <b>{{ $t('position.startDate') }}</b>
            <span
              v-text="$d(position.start * 1e3, 'short', 'en-US')"
              v-tippy="{
                content: ms(position.start)
              }"
              class="float-right link-color"
            />
          </div>
          <div>
            <b>{{ $t('position.endDate') }}</b>
            <span
              v-text="$d(position.end * 1e3, 'short', 'en-US')"
              v-tippy="{
                content: ms(position.end)
              }"
              class="link-color float-right"
            />
          </div>
        </div>
      </Block>
    </template>
  </Layout>
  <teleport to="#modal">
    <ModalConfirm
      v-if="loaded"
      :open="modalOpen"
      @close="modalOpen = false"
      @reload="loadPosition"
      :space="space"
      :position="position"
      :id="id"
    />
    <ModalTerms
      :open="modalTermsOpen"
      :space="space"
      @close="modalTermsOpen = false"
      @accept="acceptTerms(), (modalOpen = true)"
    />
  </teleport>
</template>
