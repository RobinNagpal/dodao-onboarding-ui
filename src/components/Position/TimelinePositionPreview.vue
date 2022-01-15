<script setup>
import { watchEffect, computed } from 'vue';
import { shorten, toNow, n } from '@/helpers/utils';
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
  if (props.position.state === 'active') return 'positionToNow';
  return 'positionStartIn';
});

const { address, profile, username } = useUsername();

watchEffect(() => {
  address.value = props.position.author;
  profile.value = props.profiles[props.position.author];
});
</script>

<template>
  <div class="transition-colors border-b last-child-border-0">
    <router-link
      class="p-4 block text-color"
      :to="{
        name: 'spacePosition',
        params: { key: position.space.id, id: position.id }
      }"
    >
      <div>
        <div class="mb-2">
          <router-link
            class="text-color group"
            :to="{
              name: 'spacePositions',
              params: { key: position.space.id }
            }"
          >
            <Token :space="position.space" size="28" />
            <span
              class="ml-2 group-hover:text-skin-link"
              v-text="position.space.name"
            />
          </router-link>
          {{ $tc('positionBy', [username]) }}
          <Badges
            :address="position.author"
            :members="position.space.members"
          />
        </div>
        <h3 v-text="position.title" class="mt-1 mb-1" />
        <p v-text="shorten(body, 120)" class="break-words mb-2 text-md" />
        <div
          v-if="
            position.scores_state === 'final' &&
            position.scores_total > 0 &&
            position.choices.length <= 6
          "
          class="mb-3"
        >
          <div
            v-for="(choice, i) in position.choices"
            :key="i"
            class="mt-1 w-full relative"
          >
            <div class="absolute leading-[43px] ml-3 link-color">
              <Icon
                name="check1"
                size="20"
                class="mr-1 -ml-1 align-middle"
                v-if="i === winningChoice"
              />
              {{ shorten(choice, 32) }}
              <span class="text-color ml-1">
                {{ n(position.scores[i]) }} {{ position.space.symbol }}
              </span>
            </div>
            <div
              v-text="
                n((1 / position.scores_total) * position.scores[i], '0.[0]%')
              "
              class="absolute right-0 leading-[40px] mr-3 link-color"
            />
            <div
              :style="`width: ${
                (100 / position.scores_total) * position.scores[i]
              }%;`"
              class="bg-[color:var(--border-color)] rounded-md h-[40px]"
            />
          </div>
        </div>
        <div>
          <UiState :state="position.state" slim class="mr-1" />
          {{ $t(`positions.states.${position.state}`) }},
          <span
            v-if="position.scores_state !== 'final'"
            v-text="$tc(period, [toNow(position.end)])"
          />
          <span v-if="position.scores_state === 'final'" class="mt-2">
            {{ n(position.votes, '0,00') }} votes
          </span>
        </div>
      </div>
    </router-link>
  </div>
</template>
