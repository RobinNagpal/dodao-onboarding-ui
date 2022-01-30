<script setup lang="ts">
import { useViewGuide } from '@/composables/useViewGuide';
import { GuideQuery_guide_steps } from '@/graphql/generated/graphqlDocs';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed, inject, onMounted, PropType, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getIpfsUrl, setPageTitle } from '@/helpers/utils';
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
  space: Object as PropType<SpaceModel>,
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

const uuid = route.params.uuid;

const modalOpen = ref(false);

const {
  guideRef: guide,
  guideLoaded,
  initialize
} = useViewGuide(uuid as string);

const isCreator = computed(() =>
  guide.value?.authors.includes(web3Account.value)
);

const loaded = computed(() => !props.spaceLoading && guideLoaded.value);
const isAdmin = computed(() => {
  const admins = (props.space?.admins || []).map(admin => admin.toLowerCase());
  return admins.includes(web3Account.value?.toLowerCase());
});
const threeDotItems = computed(() => {
  const items = [{ text: t('guide.duplicate'), action: 'duplicate' }];
  if (isAdmin.value || isCreator.value)
    items.push({ text: t('guide.delete'), action: 'delete' });
  items.push({ text: t('guide.edit'), action: 'edit' });
  return items;
});

const browserHasHistory = computed(() => window.history.state.back);

const { modalTermsOpen, acceptTerms } = useTerms(props.spaceId);

const activeStepId = ref();

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

async function editGuide() {
  router.push({ name: 'guideEdit', params: { uuid: guide.value?.uuid } });
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
  if (e === 'edit') editGuide();
  if (e === 'duplicate')
    router.push({
      name: 'spaceCreate',
      params: {
        key: props.spaceId,
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
  guide.value?.authors && loadProfiles([...guide.value.authors]);
});

watch([loaded, web3Account], () => {
  if (web3.value.authLoading && !web3Account.value) return;
  if (!loaded.value) return;
});

onMounted(async () => {
  await initialize();
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
  <div class="flex w-[1248px] mx-auto pr-4">
    <LayoutSingle v-bind="$attrs">
      <template #content>
        <template v-if="loaded">
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
                <div class="flex justify-between">
                  <UiMarkdown :body="guide?.content" class="mb-6 w-[60%]" />
                  <div>
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
                        <Icon
                          name="upload"
                          size="25"
                          class="!align-text-bottom"
                        />
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
                </div>
              </div>
              <Block :title="$t('guide.create.basicInfo')" :class="`mt-4`">
                <GuideViewStepper
                  :activeStepId="activeStepId"
                  :steps="steps"
                  :goToNextStep="goToNextStep"
                />
              </Block>
            </template>
          </div>
        </template>
        <PageLoading v-else />
      </template>
    </LayoutSingle>
    <template v-if="loaded">
      <Block :title="$t('information')" class="bg-skin-bg mt-4 w-[280px]">
        <div class="space-y-1">
          <div>
            <b>{{ $t('author') }}</b>
            <template v-for="author in guide.authors" :key="author">
              <User
                :address="author"
                :profile="profiles[author]"
                :space="space"
                :guide="guide"
                class="float-right"
              />
            </template>
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
  </div>
  <teleport to="#modal">
    <ModalConfirm
      v-if="loaded"
      :open="modalOpen"
      @close="modalOpen = false"
      :space="space"
      :guide="guide"
      :id="spaceId"
    />
    <ModalTerms
      :open="modalTermsOpen"
      :space="space"
      @close="modalTermsOpen = false"
      @accept="acceptTerms(), (modalOpen = true)"
    />
  </teleport>
</template>
