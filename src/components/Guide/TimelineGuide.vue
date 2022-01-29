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
  <Block
    :slim="true"
    class="timeline-guide transition-colors card feature-card py-2 px-4"
  >
    <div class="">
      <router-link
        class="card blog-card w-inline-block p-4"
        :to="{
          name: 'guide',
          params: { key: guide.space.id, uuid: guide.uuid }
        }"
      >
        <div>
          <h3 v-text="guide.name" class="my-1" />
          <p
            v-text="shorten(guide.content, 300)"
            class="break-words mb-2 text-md"
          />
        </div>
      </router-link>
    </div>
  </Block>
</template>

<style scoped lang="scss">
.timeline-guide {
  &:hover {
    border-color: var(--link-color) !important;
  }
}
</style>
