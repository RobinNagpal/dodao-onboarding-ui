<script setup>
import { watchEffect, computed } from 'vue';
import { shorten, ms, n } from '@/helpers/utils';
import { useUsername } from '@/composables/useUsername';
import removeMd from 'remove-markdown';

const props = defineProps({
  position: Object,
  profiles: Object
});

const body = computed(() => removeMd(props.position.body));

const winningChoice = computed(() =>
  props.position.scores.indexOf(Math.max(...props.position.scores))
);

const period = computed(() => {
  if (props.position.state === 'closed') return 'endedAgo';
  if (props.position.state === 'active') return 'endIn';
  return 'startIn';
});

const { address, profile, username } = useUsername();

watchEffect(() => {
  address.value = props.position.author;
  profile.value = props.profiles[props.position.author];
});
</script>

<template>
  <Block slim class="timeline-position transition-colors">
    <router-link
      class="p-4 block text-color"
      :to="{
        name: 'spacePosition',
        params: { key: position.space.id, id: position.id }
      }"
    >
      <div>
        <div class="mb-2">
          <Token :space="position.space" size="28" />
          <span class="ml-2" v-text="position.space.name" />
          {{ $tc('positionBy', [username]) }}
          <Badges
            :address="position.author"
            :members="position.space.members"
          />
          <UiState :state="position.state" class="inline-block float-right" />
        </div>
        <h3 v-text="position.title" class="my-1" />
        <p v-text="shorten(body, 140)" class="break-words mb-2 text-md" />
        <div>
          <span
            v-if="position.scores_state !== 'final'"
            v-text="$tc(period, [ms(position.start), ms(position.end)])"
          />
          <span
            v-if="position.scores_state === 'final'"
            class="mt-2 flex space-x-1 items-center"
          >
            <Icon size="20" name="check1" class="text-green" />
            <span class="mt-1"
              >{{ shorten(position.choices[winningChoice], 64) }} -
              {{ n(position.scores[winningChoice]) }}
              {{ position.space.symbol }}</span
            >
          </span>
        </div>
      </div>
    </router-link>
  </Block>
</template>

<style scoped lang="scss">
.timeline-position {
  &:hover {
    border-color: var(--link-color) !important;
  }
}
</style>
