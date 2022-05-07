<script setup lang="ts">
import UiThumbnail from '@/components/Ui/Thumbnail.vue';
import { shorten } from '@/helpers/utils';

const props = defineProps({
  guide: Object,
  profiles: Object
});
</script>

<template>
  <div role="listitem" class="card feature-card h-full">
    <router-link
      :to="{
        name: 'guide',
        params: {
          key: guide.space.id,
          uuid: guide.uuid,
          guideType: guide.guideType
        }
      }"
      class="card blog-card w-inline-block h-full w-full"
    >
      <div class="image-wrapper blog-card-thumbnail w-full">
        <UiThumbnail
          :src="guide.thumbnail"
          :entityId="guide.uuid"
          :title="guide.name"
          size="350"
          class="mb-1 w-full"
          big_tile
          :image-class="'w-full'"
        />
      </div>
      <div class="p-4 text-center">
        <h2
          class="text-base font-bold whitespace-nowrap overflow-hidden text-ellipsis"
          v-text="shorten(guide.name, 32)"
        />
        <p
          v-text="shorten(guide.content, 300)"
          class="break-words mb-2 text-sm h-65px] text-ellipsis overflow-hidden text-sm"
        />
      </div>
      <div class="flex flex-wrap justify-end absolute top-2 right-2">
        <div
          class="badge post-category mb-1"
          v-for="category in guide.categories || []"
          :key="category"
        >
          {{ $t('guide.category.' + category) }}
        </div>
      </div>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.timeline-guide {
  &:hover {
    border-color: var(--link-color) !important;
  }
}
</style>
