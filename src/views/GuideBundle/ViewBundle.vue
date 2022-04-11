<script setup lang="ts">
import Block from '@/components/Block.vue';
import GuideGuideinBundle from '@/components/Guide/GuideInBundle.vue';
import RowLoading from '@/components/RowLoading.vue';
import UiThumbnail from '@/components/Ui/Thumbnail.vue';
import Icon from '@/components/Icon.vue';
import { useApolloQuery } from '@/composables/useApolloQuery';
import { useProfiles } from '@/composables/useProfiles';
import { useSharing } from '@/composables/useSharing';
import { useSpace } from '@/composables/useSpace';
import { useStore } from '@/composables/useStore';
import { GuideBundleQuery_guideBundle } from '@/graphql/generated/graphqlDocs';
import { GuideBundleQuery } from '@/graphql/guideBundles.graphql';
import { setPageTitle } from '@/helpers/utils';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { marked } from 'marked';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { PropType } from 'vue/dist/vue';

const renderer = new marked.Renderer();

const props = defineProps({
  spaceId: String,
  space: { type: Object as PropType<SpaceModel>, required: true },
  spaceLoading: Boolean
});

const { store } = useStore();

const loading = ref(false);
const guideBundle = ref<GuideBundleQuery_guideBundle | null>(null);

const { apolloQuery } = useApolloQuery();

const route = useRoute();

const { t } = useI18n();

const { isAdmin } = useSpace(props.space);

const {
  shareToTwitter,
  shareToFacebook,
  shareToClipboard,
  startShare,
  sharingIsSupported,
  sharingItems
} = useSharing();

const router = useRouter();

const uuid = route.params.uuid;

async function loadGuideBundle() {
  loading.value = true;
  const bundleObj = await apolloQuery(
    {
      query: GuideBundleQuery,
      variables: {
        uuid
      }
    },
    'guideBundle'
  );
  guideBundle.value = bundleObj;
  loading.value = false;
}

onMounted(() => {
  setPageTitle('page.title.dao.bundle', { dao: props.space.name });
  loadGuideBundle();
});

const bundleContents = computed(() => {
  return guideBundle.value
    ? marked.parse(guideBundle.value.content, { renderer })
    : null;
});

const threeDotItems = computed(() => {
  const items: Array<{ text: string; action: string }> = [];

  items.push({ text: t('guideBundle.edit'), action: 'edit' });
  return items;
});

async function editBundle() {
  await router.push({
    name: 'guideBundleEdit',
    params: { uuid: guideBundle.value?.uuid }
  });
}

function selectFromThreedotDropdown(e) {
  if (e === 'edit') editBundle();
}

function selectFromShareDropdown(e) {
  if (e === 'shareToTwitter')
    shareToTwitter(
      props.space,
      guideBundle.value?.name ?? '',
      'guide/view',
      guideBundle.value?.uuid ?? '',
      window
    );
  else if (e === 'shareToFacebook')
    shareToFacebook(
      props.space,
      guideBundle.value?.name ?? '',
      'guide/view',
      guideBundle.value?.uuid ?? '',
      window
    );
  else if (e === 'shareToClipboard')
    shareToClipboard(props.space, 'guide/view', guideBundle.value?.uuid ?? '');
}

const { profiles, loadProfiles } = useProfiles();
</script>

<template>
  <div class="container-default w-container" v-if="guideBundle">
    <div class="home-tabs-wrapper mt-6">
      <div
        data-duration-in="300"
        data-duration-out="100"
        data-easing="ease"
        class="home-tabs w-tabs"
      >
        <div class="card home-tabs-content w-tab-content">
          <div class="home-tab-pane w-tab-pane p-6">
            <div class="flex justify-between">
              <div class="px-4 md:px-0 mb-3">
                <a
                  class="text-color"
                  @click="
                    $router.push({
                      name: 'guideBundles',
                      params: { key: space.id }
                    })
                  "
                >
                  <Icon name="back" size="22" class="!align-middle" />
                  {{ space.name }}
                </a>
              </div>
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
                    <Icon name="upload" size="25" class="!align-text-bottom" />
                    Share
                  </div>
                </UiDropdown>
                <UiDropdown
                  top="2.5rem"
                  right="1.3rem"
                  class="float-right mr-2"
                  @select="selectFromThreedotDropdown"
                  v-if="isAdmin"
                  :items="threeDotItems"
                >
                  <div class="pr-3">
                    <UiLoading v-if="loading" class="w-full" />
                    <Icon v-else name="threedots" size="25" />
                  </div>
                </UiDropdown>
              </div>
            </div>
            <div>
              <div class="pt-4">
                <UiThumbnail
                  :src="guideBundle.thumbnail"
                  :entityId="guideBundle.id"
                  :title="guideBundle.name"
                  symbolIndex="guideBundle"
                  :big_tile="true"
                  :size="'400'"
                  class="mt-3 mb-2"
                />
              </div>
              <h2>{{ guideBundle.name }}</h2>
              <div class="pt-2">
                {{ guideBundle.excerpt }}
              </div>
              <div v-html="bundleContents" class="markdown-body pt-2" />
            </div>
          </div>
        </div>
        <div class="home-tabs-menu wf-grid w-tab-menu" role="tablist">
          <div v-if="!loading && guideBundle">
            <GuideGuideinBundle
              v-for="(guide, i) in guideBundle.bundleGuides"
              :key="i"
              :guide="{ ...guide, space }"
              :guide-bundle="guideBundle"
              :profiles="profiles"
            />
          </div>
          <div
            style="height: 10px; width: 10px; position: absolute"
            ref="endElement"
          />
        </div>
      </div>
    </div>
    <Block v-if="loading" :slim="true">
      <RowLoading class="my-2" />
    </Block>
  </div>
</template>
