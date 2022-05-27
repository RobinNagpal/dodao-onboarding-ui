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
import { useRoute } from 'vue-router';

const props = defineProps({
  space: Object,
  spaceId: String,
  spaceLoading: Boolean
});

const { store } = useStore();
const { domain } = useDomain();

const loading = ref(false);

const spaceMembers = computed(() => (props.space.members.length < 1 ? ['none'] : props.space.members));

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
      <div>
        <div class="section pricing wf-section">
          <div class="container-default w-container">
            <div class="pricing-wrapper w-dyn-list pt-8">
              <div role="list" class="_3-column-grid pricing w-dyn-items">
                <div
                  style="
                    opacity: 1;
                    transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)
                      skew(0deg, 0deg);
                    transform-style: preserve-3d;
                  "
                  role="listitem"
                  class="plan-item w-dyn-item"
                >
                  <a href="/product/starter" class="card pricing-card w-inline-block"
                    ><div class="split-content package-card-top-content">
                      <div class="top-content top-pricing-content">
                        <div class="image-wrapper package-icon">
                          <img
                            src="https://uploads-ssl.webflow.com/619693a5cb7cf8d01bc973c1/619693a5cb7cf8bf32c974f6_package-starter-techplus-x-template.png"
                            data-wf-sku-bindings="%5B%7B%22from%22%3A%22f_main_image_4dr%22%2C%22to%22%3A%22src%22%7D%5D"
                            alt=""
                            class="image package-icon"
                          />
                        </div>
                        <h3 class="mg-bottom-0">Dxdao and Far from Coding</h3>
                      </div>
                      <p class="paragraph package-about-excerpt">
                        Anyone with a computer and internet connection can take this course. If you are interested in
                        making sense of Web3, but you don't know how to read or write code, then you are in the right
                        place 😉. You might even be considering attending a Dxdao certification course, but already feel
                        lost. Don't worry. This course is a great first step for you.
                      </p>
                      <ul role="list" class="list package-features-list w-list-unstyled">
                        <li class="list-item dark-check-item">
                          <div class="package-feature">Basics of Web3</div>
                        </li>
                        <li class="list-item dark-check-item">
                          <div class="package-feature">All the products of Dxdao</div>
                        </li>
                        <li class="list-item dark-check-item">
                          <div class="package-feature">Dxdao Ecosystem</div>
                        </li>
                        <li class="list-item dark-check-item"><div class="package-feature">Business use-cases</div></li>
                      </ul>
                    </div>
                    <div class="split-content package-card-bottom-content">
                      <div class="added-cost">Duration: 30-45 mins</div>
                      <div class="button-primary popular w-condition-invisible">Get started</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NoResults :block="true" v-if="!loadingData && guideBundlesCount && store.space.guideBundles.length < 1" />
        <GuideBundleNoGuideBundles v-else-if="!guideBundlesCount && !loadingData" class="mt-2" :space="space" />
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
        <div style="height: 10px; width: 10px; position: absolute" ref="endElement" />
        <Block v-if="loadingData" :slim="true">
          <RowLoading class="my-2" />
        </Block>
      </div>
    </template>
  </LayoutTopAndBottom>
</template>
