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
  spaceLoading: Boolean,
  bundleType: String
});

const { store } = useStore();
const { domain } = useDomain();
const route = useRoute();

const bundleType = props.bundleType || route.params.bundleType;

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
        bundleType,
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
      <div class="mt-6">
        <div class="section pricing wf-section">
          <div class="container-default w-container">
            <div class="top-content pricing-top-content">
              <h1
                data-w-id="ef1fd90c-c37d-b9ff-2afc-62740b990506"
                style="
                  opacity: 1;
                  transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)
                    skew(0deg, 0deg);
                  transform-style: preserve-3d;
                "
                class="title pricing"
              >
                Pricing
              </h1>
              <p
                data-w-id="aac5f889-b698-0949-5884-fc3eebc98b98"
                style="
                  opacity: 1;
                  transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)
                    skew(0deg, 0deg);
                  transform-style: preserve-3d;
                "
                class="paragraph pricing"
              >
                Lorem ipsum dolor sit amet consectetur adipiscing elit senectus rutrum, pretium nullam integer fames
              </p>
            </div>
            <div class="pricing-wrapper w-dyn-list">
              <div role="list" class="_3-column-grid pricing w-dyn-items">
                <div
                  data-w-id="ba9a1f16-6f5f-3cdb-ea85-99338bcdd6df"
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
                        <h3 class="mg-bottom-0">Starter</h3>
                      </div>
                      <p class="paragraph package-about-excerpt">
                        Lorem ipsum dolor sit amet consect adipiscing elit et ac adipisci.
                      </p>
                      <ul role="list" class="list package-features-list w-list-unstyled">
                        <li class="list-item dark-check-item">
                          <div class="package-feature">All basic CRM features</div>
                        </li>
                        <li class="list-item dark-check-item">
                          <div class="package-feature">Up to 10,000 contacts</div>
                        </li>
                        <li class="list-item dark-check-item"><div class="package-feature">Normal support</div></li>
                        <li class="list-item last dark-check-item"><div class="package-feature">Mobile app</div></li>
                      </ul>
                    </div>
                    <div class="split-content package-card-bottom-content">
                      <div
                        data-wf-sku-bindings="%5B%7B%22from%22%3A%22f_price_%22%2C%22to%22%3A%22innerHTML%22%7D%5D"
                        class="price package-card-price"
                      >
                        $&nbsp;49.00&nbsp;USD
                      </div>
                      <div class="added-cost">10 users included ($9 /extra user)</div>
                      <div class="button-primary popular w-condition-invisible">
                        Get started<span class="button-arrow"></span>
                      </div>
                      <div data-w-id="deb68b86-8e5e-dfbe-9884-f0066a240258" class="button-secondary">
                        Get started<span
                          class="button-arrow"
                          style="
                            transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)
                              rotateZ(0deg) skew(0deg, 0deg);
                            transform-style: preserve-3d;
                          "
                          ></span
                        >
                      </div>
                    </div></a
                  >
                </div>
                <div
                  data-w-id="ba9a1f16-6f5f-3cdb-ea85-99338bcdd6df"
                  style="
                    opacity: 1;
                    transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)
                      skew(0deg, 0deg);
                    transform-style: preserve-3d;
                  "
                  role="listitem"
                  class="plan-item w-dyn-item"
                >
                  <a href="/product/business" class="card pricing-card w-inline-block"
                    ><div class="split-content package-card-top-content">
                      <div class="top-content top-pricing-content">
                        <div class="image-wrapper package-icon">
                          <img
                            src="https://uploads-ssl.webflow.com/619693a5cb7cf8d01bc973c1/619693a5cb7cf80f5cc974fa_package-business-techplus-x-template.png"
                            data-wf-sku-bindings="%5B%7B%22from%22%3A%22f_main_image_4dr%22%2C%22to%22%3A%22src%22%7D%5D"
                            alt=""
                            class="image package-icon"
                          />
                        </div>
                        <h3 class="mg-bottom-0">Business</h3>
                      </div>
                      <p class="paragraph package-about-excerpt">
                        Lorem ipsum dolor sit amet consect adipiscing elit et ac adipisci.
                      </p>
                      <ul role="list" class="list package-features-list w-list-unstyled">
                        <li class="list-item dark-check-item">
                          <div class="package-feature">All advanced CRM features</div>
                        </li>
                        <li class="list-item dark-check-item">
                          <div class="package-feature">Up to 50,000 contacts</div>
                        </li>
                        <li class="list-item dark-check-item"><div class="package-feature">Premium support</div></li>
                        <li class="list-item last dark-check-item">
                          <div class="package-feature">Custom branding</div>
                        </li>
                      </ul>
                    </div>
                    <div class="split-content package-card-bottom-content">
                      <div
                        data-wf-sku-bindings="%5B%7B%22from%22%3A%22f_price_%22%2C%22to%22%3A%22innerHTML%22%7D%5D"
                        class="price package-card-price"
                      >
                        $&nbsp;99.00&nbsp;USD
                      </div>
                      <div class="added-cost">50 users included ($5 /extra user)</div>
                      <div class="button-primary popular">
                        Get started<span
                          class="button-arrow"
                          style="
                            transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)
                              rotateZ(0deg) skew(0deg, 0deg);
                            transform-style: preserve-3d;
                          "
                          ></span
                        >
                      </div>
                      <div
                        data-w-id="deb68b86-8e5e-dfbe-9884-f0066a240258"
                        class="button-secondary w-condition-invisible"
                      >
                        Get started<span class="button-arrow"></span>
                      </div>
                    </div></a
                  >
                </div>
                <div
                  data-w-id="ba9a1f16-6f5f-3cdb-ea85-99338bcdd6df"
                  style="
                    opacity: 1;
                    transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg)
                      skew(0deg, 0deg);
                    transform-style: preserve-3d;
                  "
                  role="listitem"
                  class="plan-item w-dyn-item"
                >
                  <a href="/product/enterprise" class="card pricing-card w-inline-block"
                    ><div class="split-content package-card-top-content">
                      <div class="top-content top-pricing-content">
                        <div class="image-wrapper package-icon">
                          <img
                            src="https://uploads-ssl.webflow.com/619693a5cb7cf8d01bc973c1/619693a5cb7cf8adf8c974f3_package-enterprise-techplus-x-template.png"
                            data-wf-sku-bindings="%5B%7B%22from%22%3A%22f_main_image_4dr%22%2C%22to%22%3A%22src%22%7D%5D"
                            alt=""
                            class="image package-icon"
                          />
                        </div>
                        <h3 class="mg-bottom-0">Enterprise</h3>
                      </div>
                      <p class="paragraph package-about-excerpt">
                        Lorem ipsum dolor sit amet consect adipiscing elit et ac adipisci.
                      </p>
                      <ul role="list" class="list package-features-list w-list-unstyled">
                        <li class="list-item dark-check-item">
                          <div class="package-feature">All enterprise CRM features</div>
                        </li>
                        <li class="list-item dark-check-item">
                          <div class="package-feature">Up to 200,000 contacts</div>
                        </li>
                        <li class="list-item dark-check-item"><div class="package-feature">Dedicated support</div></li>
                        <li class="list-item last dark-check-item">
                          <div class="package-feature">Account manager</div>
                        </li>
                      </ul>
                    </div>
                    <div class="split-content package-card-bottom-content">
                      <div
                        data-wf-sku-bindings="%5B%7B%22from%22%3A%22f_price_%22%2C%22to%22%3A%22innerHTML%22%7D%5D"
                        class="price package-card-price"
                      >
                        $&nbsp;299.00&nbsp;USD
                      </div>
                      <div class="added-cost">200 users included ($5 /extra user)</div>
                      <div class="button-primary popular w-condition-invisible">
                        Get started<span class="button-arrow"></span>
                      </div>
                      <div data-w-id="deb68b86-8e5e-dfbe-9884-f0066a240258" class="button-secondary">
                        Get started<span class="button-arrow"></span>
                      </div>
                    </div></a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <NoResults :block="true" v-if="!loadingData && guideBundlesCount && store.space.guideBundles.length < 1" />
        <GuideBundleNoGuideBundles
          v-else-if="!guideBundlesCount && !loadingData"
          class="mt-2"
          :space="space"
          :bundleType="bundleType"
        />
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
