<script setup lang="ts">
import { GuideBundleQuery_guideBundle } from '@/graphql/generated/graphqlDocs';
import { computed, onMounted, ref, watch } from 'vue';
import LayoutTopAndBottom from '@/components/Layout/TopAndBottom.vue';
import LayoutSingle from '@/components/Layout/Single.vue';
import BlockSpaceNew from '@/components/Block/SpaceNew.vue';
import GuideGuideinBundle from '@/components/Guide/GuideInBundle.vue';
import Block from '@/components/Block.vue';
import RowLoading from '@/components/RowLoading.vue';
import { useApolloQuery } from '@/composables/useApolloQuery';
import { GuideBundleQuery } from '@/graphql/guideBundles.graphql';
import { useProfiles } from '@/composables/useProfiles';
import { setPageTitle } from '@/helpers/utils';
import { useStore } from '@/composables/useStore';
import { useRoute } from 'vue-router';
import { PropType } from 'vue/dist/vue';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';

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

const { profiles, loadProfiles } = useProfiles();
</script>

<template>
  <div>
    <div class="container-default w-container">
      <div class="home-tabs-wrapper mt-6">
        <div
          data-duration-in="300"
          data-duration-out="100"
          data-easing="ease"
          class="home-tabs w-tabs"
        >
          <div class="home-tabs-content w-tab-content">
            <div class="home-tab-pane w-tab-pane">
              <div
                v-if="!loading && guideBundle"
                class="image-wrapper integration-icon-wrapper flex flex-col items-center px-12 mb-2"
              >
                <UiThumbnail
                  :src="guideBundle.thumbnail"
                  :entityId="guideBundle.id"
                  :title="guideBundle.name"
                  symbolIndex="guideBundle"
                  size="200"
                  class="mt-3 mb-2"
                />
              </div>
            </div>
          </div>
          <div class="home-tabs-menu wf-grid w-tab-menu" role="tablist">
            <div v-if="!loading && guideBundle">
              <GuideGuideinBundle
                v-for="(guide, i) in guideBundle.bundleGuides"
                :key="i"
                :guide="{ ...guide, space }"
                :profiles="profiles"
              />
            </div>
            <div
              style="height: 10px; width: 10px; position: absolute"
              ref="endElement"
            />
            <Block v-if="loading" :slim="true">
              <RowLoading class="my-2" />
            </Block>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
