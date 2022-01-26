<script setup lang="ts">
import {
  GuideQuery_guide,
  GuideQuery_guide_steps
} from '@/graphql/generated/graphqlDocs';
import { GuideStep } from '@/models/Guide';
import { Ref } from '@vue/reactivity';
import { computed, inject, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getGuide, getPower } from '@/helpers/snapshot';
import { getIpfsUrl, ms, setPageTitle } from '@/helpers/utils';
import { useTerms } from '@/composables/useTerms';
import { useProfiles } from '@/composables/useProfiles';
import { useDomain } from '@/composables/useDomain';
import { useSharing } from '@/composables/useSharing';
import { useWeb3 } from '@/composables/useWeb3';
import { useClient } from '@/composables/useClient';
import { useApp } from '@/composables/useApp';
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
const notify = inject('notify') as Function;

const id = route.params.id;

const modalOpen = ref(false);
const loading = ref(true);
const guide: Ref<GuideQuery_guide | undefined> = ref<
  GuideQuery_guide | undefined
>();
const totalScore = ref(0);
const scores = ref([]);

const isCreator = computed(() => guide.value?.author === web3Account.value);
const loaded = computed(() => !props.spaceLoading && !loading.value);
const isAdmin = computed(() => {
  const admins = (props.space?.admins || []).map(admin => admin.toLowerCase());
  return admins.includes(web3Account.value?.toLowerCase());
});
const threeDotItems = computed(() => {
  const items = [{ text: t('guide.duplicate'), action: 'duplicate' }];
  if (isAdmin.value || isCreator.value)
    items.push({ text: t('guide.delete'), action: 'delete' });
  return items;
});

const browserHasHistory = computed(() => window.history.state.back);

const { modalTermsOpen, acceptTerms } = useTerms(props.spaceId);

const activeStepId = ref();

async function loadGuide() {
  guide.value = await getGuide(id);
  // Redirect to guide spaceId if it doesn't match route key
  if (route.name === 'guide' && props.spaceId !== guide.value?.space?.id) {
    router.push({ name: 'error-404' });
  }

  activeStepId.value = guide.value?.steps[0]?.uuid;

  loading.value = false;
}

async function loadPower() {
  if (!web3Account.value || !guide.value?.author) return;
  const response = await getPower(props.space, web3Account.value, guide.value);
  totalScore.value = response.totalScore;
  scores.value = response.scores;
}

async function deleteGuide() {
  const result = await send(props.space, 'delete-guide', {
    guide: guide.value
  });
  console.log('Result', result);
  if (result.id) {
    getExplore();
    store.space.guides = [];
    notify?.(['green', t('notify.guideDeleted')]);
    router.push({ name: 'guide' });
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
  if (e === 'delete') deleteGuide();
  if (e === 'duplicate')
    router.push({
      name: 'spaceCreate',
      params: {
        key: guide.value?.space?.id,
        from: guide.value?.id
      }
    });
}

function selectFromShareDropdown(e) {
  if (e === 'shareToTwitter') shareToTwitter(props.space, guide.value, window);
  else if (e === 'shareToFacebook')
    shareToFacebook(props.space, guide.value, window);
  else if (e === 'shareToClipboard') shareToClipboard(props.space, guide.value);
}

const { profiles, loadProfiles } = useProfiles();

watch(guide, () => {
  guide.value?.author && loadProfiles([guide.value.author]);
});

watch(web3Account, (val, prev) => {
  if (val?.toLowerCase() !== prev) loadPower();
});

watch([loaded, web3Account], () => {
  if (web3.value.authLoading && !web3Account.value) return;
  if (!loaded.value) return;
  loadPower();
});

onMounted(async () => {
  await loadGuide();
  setPageTitle('page.title.space.guide', {
    guide: guide.value?.name,
    space: props.space?.name
  });
});

const steps = computed(() => {
  return guide.value?.steps || [];
});

function goToNextStep(currentStep: GuideQuery_guide_steps) {
  currentStep.order;
  const nextStep = steps.value.find(
    step => step?.order === currentStep.order + 1
  );
  activeStepId.value = nextStep?.uuid;
}
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
              : $router.push(domain ? { path: '/' } : { name: 'guide' })
          "
        >
          <Icon name="back" size="22" class="!align-middle" />
          {{ browserHasHistory ? $t('back') : space.name }}
        </a>
      </div>
      <div class="px-4 md:px-0">
        <template v-if="loaded">
          <h1 v-text="guide?.name" class="mb-2" />
          <div class="mb-4">
            <UiDropdown
              top="2.5rem"
              right="1.5rem"
              class="float-right mr-2"
              @select="selectFromShareDropdown"
              @clickedNoDropdown="startShare(space, guide)"
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
          <UiMarkdown :body="guide?.content" class="mb-6" />
          <Block :title="$t('guide.create.basicInfo')" :class="`mt-4`">
            <GuideViewStepper
              :activeStepId="activeStepId"
              :steps="steps"
              :goToNextStep="goToNextStep"
            />
          </Block>
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
              :address="guide.author"
              :profile="profiles[guide.author]"
              :space="space"
              :guide="guide"
              class="float-right"
            />
          </div>
          <div>
            <b>IPFS</b>
            <a
              :href="getIpfsUrl(guide.ipfs)"
              target="_blank"
              class="float-right"
            >
              #{{ guide.ipfs.slice(0, 7) }}
              <Icon name="external-link" class="ml-1" />
            </a>
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
      @reload="loadGuide"
      :space="space"
      :guide="guide"
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
