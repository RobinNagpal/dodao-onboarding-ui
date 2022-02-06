<script setup>
import { watchEffect } from 'vue';
import { shorten } from '@/helpers/utils';
import { useUsername } from '@/composables/useUsername';

const props = defineProps({
  guide: Object,
  profiles: Object
});

const { address, profile } = useUsername();

watchEffect(() => {
  address.value = props.guide.author;
  profile.value = props.profiles[props.guide.author];
});
</script>

<template>
  <router-link
    :to="{
      name: 'guide',
      params: { key: guide.space.id, uuid: guide.uuid }
    }"
  >
    <div role="listitem" class="card feature-card">
      <div class="image-wrapper blog-card-thumbnail">
        <UiThumbnail
          :src="guide.thumbnail"
          :entityId="guide.uuid"
          :title="guide.name"
          size="350"
          class="mb-1"
          big_tile
        />
      </div>
      <div class="p-4 text-center">
        <h2 v-text="shorten(guide.name, 32)" />
        <p
          v-text="shorten(guide.content, 300)"
          class="break-words mb-2 text-md h-[50px] text-ellipsis overflow-hidden"
        />
      </div>
      <div class="flex justify-end absolute top-4 right-4">
        <div
          class="badge post-category"
          v-for="category in guide.categories || []"
          :key="category"
        >
          {{ category }}
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
