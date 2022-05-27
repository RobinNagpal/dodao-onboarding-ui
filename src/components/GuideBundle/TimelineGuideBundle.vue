<script setup lang="ts">
import UiThumbnail from '@/components/Ui/Thumbnail.vue';
import { shorten } from '@/helpers/utils';
import { GuideBundleModel } from '@dodao/onboarding-schemas/models/GuideBundleModel';
import { PropType } from 'vue';

const props = defineProps({
  guideBundle: { type: Object as PropType<GuideBundleModel> },
  profiles: Object
});
</script>

<template>
  <router-link
    :to="{
      name: 'guideBundle',
      params: { key: guideBundle.space.id, uuid: guideBundle.uuid }
    }"
  >
    <div role="listitem" class="card pricing-card w-inline-block">
      <div class="split-content package-card-top-content">
        <div class="top-content top-pricing-content">
          <div class="image-wrapper package-icon">
            <UiThumbnail
              :src="guideBundle.thumbnail"
              :entityId="guideBundle.uuid"
              :title="guideBundle.name"
              size="100"
              class="image package-icon"
            />
          </div>
          <h3 class="mg-bottom-0" v-text="shorten(guideBundle.name, 32)" />
        </div>
        <p class="paragraph package-about-excerpt" v-text="shorten(guideBundle.excerpt, 300)" />

        <ul role="list" class="list package-features-list w-list-unstyled">
          <template v-for="highlight in guideBundle.highlights" :key="highlight">
            <li class="list-item dark-check-item">
              <div class="package-feature">{{ highlight }}</div>
            </li>
          </template>
        </ul>
      </div>
      <div class="split-content package-card-bottom-content">
        <div class="added-cost">Duration: {{ guideBundle.duration }}</div>
        <div class="button-primary popular w-condition-invisible">Get started</div>
      </div>
    </div>
  </router-link>
</template>

<style scoped lang="scss">
.timeline-guide {
  &:hover {
    border-color: var(--link-color) !important;
  }
}
</style>
