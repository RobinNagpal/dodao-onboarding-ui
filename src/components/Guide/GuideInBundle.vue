<script setup lang="ts">
import UiThumbnail from '@/components/Ui/Thumbnail.vue';
import { GuideBundleQuery_guideBundle } from '@/graphql/generated/graphqlDocs';
import { shorten } from '@/helpers/utils';
import { PropType } from 'vue';

const props = defineProps({
  guideBundle: { type: Object as PropType<GuideBundleQuery_guideBundle> },
  guide: Object,
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
            uuid: guideBundle.uuid,
            bundleType: guideBundle.bundleType
          }
        })
      }
    }"
  >
    <div
      role="listitem"
      class="card home-hero-tab guide-in-bundle-card w-full flex mb-4"
    >
      <div class="guide-image">
        <UiThumbnail
          :src="guide.thumbnail"
          :entityId="guide.uuid"
          :title="guide.name"
          :size="'150'"
          :big_tile="false"
        />
      </div>

      <div class="p-2">
        <h1
          class="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis"
          v-text="shorten(guide.name, 32)"
        />
        <p
          v-text="shorten(guide.content, 300)"
          class="break-words mb-2 text-sm h-[95px] text-ellipsis overflow-hidden text-sm"
        />
      </div>
      <div class="flex flex-wrap justify-end absolute top-4 right-4">
        <div
          class="badge post-category mb-1"
          v-for="category in guide.categories || []"
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

.guide-image {
  width: 270px;
}
</style>
