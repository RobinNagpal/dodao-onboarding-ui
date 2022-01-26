<script setup>
import { watchEffect, computed } from 'vue';
import { shorten, ms, n } from '@/helpers/utils';
import { useUsername } from '@/composables/useUsername';
import removeMd from 'remove-markdown';

const props = defineProps({
  guide: Object,
  profiles: Object
});

const body = computed(() => removeMd(props.guide.body));

const winningChoice = computed(() =>
  props.guide.scores.indexOf(Math.max(...props.guide.scores))
);

const period = computed(() => {
  if (props.guide.state === 'closed') return 'endedAgo';
  if (props.guide.state === 'active') return 'endIn';
  return 'startIn';
});

const { address, profile, username } = useUsername();

watchEffect(() => {
  address.value = props.guide.author;
  profile.value = props.profiles[props.guide.author];
});
</script>

<template>
  <Block slim class="timeline-guide transition-colors">
    <router-link
      class="p-4 block text-color"
      :to="{
        name: 'guide',
        params: { key: guide.space.id, id: guide.id }
      }"
    >
      <div>
        <h3 v-text="guide.name" class="my-1" />
        <p
          v-text="shorten(guide.content, 140)"
          class="break-words mb-2 text-md"
        />
      </div>
    </router-link>
  </Block>
</template>

<style scoped lang="scss">
.timeline-guide {
  &:hover {
    border-color: var(--link-color) !important;
  }
}
</style>
