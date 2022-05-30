<script setup lang="ts">
import UiThumbnail from '@/components/Ui/Thumbnail.vue';
import {
  GuideBundleQuery_guideBundle,
  GuideBundleQuery_guideBundle_bundleGuides
} from '@/graphql/generated/graphqlDocs';
import { PropType } from 'vue';

defineProps({
  guideBundle: { type: Object as PropType<GuideBundleQuery_guideBundle> },
  guide: { type: Object as PropType<GuideBundleQuery_guideBundle_bundleGuides>, required: true },
  profiles: Object
});
</script>

<template>
  <router-link
    :to="{
      name: 'guide',
      params: {
        key: guide.space.id,
        uuid: guide.uuid,
        guideType: guide.guideType,
        from: JSON.stringify({
          displayName: guideBundle.name,
          name: 'guideBundle',
          params: {
            key: guideBundle.space.id,
            uuid: guideBundle.uuid
          }
        })
      }
    }"
    class="guide-bundle-guides-list-item w-full flex"
  >
    <div class="guide-number flex flex-col justify-center align-center">
      <div class="circle">
        {{ guide.order + 1 }}
      </div>
    </div>
    <div class="guide-image">
      <UiThumbnail :src="guide.thumbnail" :entityId="guide.uuid" :title="guide.name" :size="'100'" :big_tile="false" />
    </div>

    <div class="p-2">
      <h1 class="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis" v-text="guide.name" />
      <p v-text="guide.content" class="break-words mb-2 text-sm" />
    </div>
  </router-link>
</template>

<style scoped lang="scss">
.guide-number {
  font-size: 48px;
  text-align: center;
  color: var(--border-color);

  .circle {
    width: 80px;
    height: 80px;
    line-height: 65px;
    border-radius: 50%;
    border: 8px solid var(--border-color);
  }
}

.timeline-guide {
  &:hover {
    border-color: var(--link-color) !important;
  }
}

.guide-image {
  width: 200px;
}

.guide-bundle-guides-list-item {
  padding: 24px 0;
  border-top: 1px solid var(--border-color);

  transition: transform 300ms ease;

  &:hover {
    transform: scale3d(0.95, 0.95, 1.01);
  }

  &:last-of-type {
    border-bottom: 1px solid var(--border-color);
  }
}
</style>
