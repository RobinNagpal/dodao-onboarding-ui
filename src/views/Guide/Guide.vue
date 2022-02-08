<script setup lang="ts">
import Block from '@/components/Block.vue';
import GuideViewStepper from '@/components/Guide/View/Stepper.vue';
import Icon from '@/components/Icon.vue';
import LayoutSingle from '@/components/Layout/Single.vue';
import ModalConfirm from '@/components/Modal/Confirm.vue';
import PageLoading from '@/components/PageLoading.vue';
import UiDropdown from '@/components/Ui/Dropdown.vue';
import UiMarkdown from '@/components/Ui/Markdown.vue';
import User from '@/components/User.vue';
import { useApp } from '@/composables/useApp';
import { useClient } from '@/composables/useClient';
import { useDomain } from '@/composables/useDomain';
import { useProfiles } from '@/composables/useProfiles';
import { useSharing } from '@/composables/useSharing';
import { useStore } from '@/composables/useStore';
import { useViewGuide } from '@/composables/useViewGuide';
import { useWeb3 } from '@/composables/useWeb3';
import { getIpfsUrl, setPageTitle } from '@/helpers/utils';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed, inject, onMounted, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  spaceId: String,
  space: { type: Object as PropType<SpaceModel>, required: true },
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
  activeStepId,
  goToNextStep,
  goToPreviousStep,
  guideRef: guide,
  guideLoaded,
  guideResponseRef,
  initialize,
  selectAnswer,
  submitGuide
} = useViewGuide(uuid as string, notify, props.space);

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

async function deleteGuide() {
  const result = await send(props.space, 'delete-guide', {
    guide: guide.value
  });
  console.log('Result', result);
  if (result?.id) {
    await getExplore();
    store.space.guides = [];
    notify?.(['green', t('notify.guideDeleted')]);
    await router.push({ name: 'guide' });
  }
}

async function editGuide() {
  await router.push({ name: 'guideEdit', params: { uuid: guide.value?.uuid } });
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
                  <UiMarkdown :body="guide?.content" class="mb-6 w-[80%]" />
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
              <Block
                :title="$t('guide.onboardingSteps')"
                :class="`mt-4`"
                v-if="guideLoaded && guide"
              >
                <GuideViewStepper
                  :activeStepId="activeStepId"
                  :goToNextStep="goToNextStep"
                  :goToPreviousStep="goToPreviousStep"
                  :guide="guide"
                  :guideResponse="guideResponseRef"
                  :selectAnswer="selectAnswer"
                  :submitGuide="submitGuide"
                />
              </Block>
            </template>
          </div>
        </template>
        <PageLoading v-else />
      </template>
    </LayoutSingle>
    <template v-if="loaded">
      <div
        class="bg-skin-bg mt-4 w-[280px] h-[280px] info-bar card guide-right-side-card"
      >
        <h3>{{ $t('information') }}</h3>
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
      </div>
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
  </teleport>
</template>

<style scoped lang="scss">
.info-bar {
  box-shadow: var(--box-shadow);
  border-color: var(--border-color);
}
</style>
