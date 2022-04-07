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
    <div role="listitem" class="card feature-card">
      <div class="image-wrapper blog-card-thumbnail">
        <UiThumbnail
          :src="guideBundle.thumbnail"
          :entityId="guideBundle.uuid"
          :title="guideBundle.name"
          size="350"
          class="mb-1"
          big_tile
        />
      </div>
      <div class="p-4 text-center">
        <h2
          class="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis"
          v-text="shorten(guideBundle.name, 32)"
        />
        <p
          v-text="shorten(guideBundle.excerpt, 300)"
          class="break-words mb-2 text-sm h-[95px] text-ellipsis overflow-hidden text-sm"
        />
      </div>
      <div class="flex flex-wrap justify-end absolute top-4 right-4">
        <div
          class="badge post-category mb-1"
          v-for="category in guideBundle.categories || []"
          :key="category"
        >
          {{ $t('guide.category.' + category) }}
        </div>
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
