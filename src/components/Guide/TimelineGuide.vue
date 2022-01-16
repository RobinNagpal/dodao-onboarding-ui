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
        <div class="mb-2">
          <Token :space="guide.space" size="28" />
          <span class="ml-2" v-text="guide.space.name" />
          {{ $tc('guideBy', [username]) }}
          <Badges :address="guide.author" :members="guide.space.members" />
          <UiState :state="guide.state" class="inline-block float-right" />
        </div>
        <h3 v-text="guide.title" class="my-1" />
        <p v-text="shorten(body, 140)" class="break-words mb-2 text-md" />
        <div>
          <span
            v-if="guide.scores_state !== 'final'"
            v-text="$tc(period, [ms(guide.start), ms(guide.end)])"
          />
          <span
            v-if="guide.scores_state === 'final'"
            class="mt-2 flex space-x-1 items-center"
          >
            <Icon size="20" name="check1" class="text-green" />
            <span class="mt-1"
              >{{ shorten(guide.choices[winningChoice], 64) }} -
              {{ n(guide.scores[winningChoice]) }}
              {{ guide.space.symbol }}</span
            >
          </span>
        </div>
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
