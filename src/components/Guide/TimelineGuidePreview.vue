<script setup>
import { watchEffect, computed } from 'vue';
import { shorten, toNow, n } from '@/helpers/utils';
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
  if (props.guide.state === 'active') return 'guideToNow';
  return 'guideStartIn';
});

const { address, profile, username } = useUsername();

watchEffect(() => {
  address.value = props.guide.author;
  profile.value = props.profiles[props.guide.author];
});
</script>

<template>
  <div class="transition-colors border-b last-child-border-0">
    <router-link
      class="p-4 block text-color"
      :to="{
        name: 'spaceGuide',
        params: { key: guide.space.id, id: guide.id }
      }"
    >
      <div>
        <div class="mb-2">
          <router-link
            class="text-color group"
            :to="{
              name: 'spaceGuides',
              params: { key: guide.space.id }
            }"
          >
            <Token :space="guide.space" size="28" />
            <span
              class="ml-2 group-hover:text-skin-link"
              v-text="guide.space.name"
            />
          </router-link>
          {{ $tc('guideBy', [username]) }}
          <Badges :address="guide.author" :members="guide.space.members" />
        </div>
        <h3 v-text="guide.title" class="mt-1 mb-1" />
        <p v-text="shorten(body, 120)" class="break-words mb-2 text-md" />
        <div
          v-if="
            guide.scores_state === 'final' &&
            guide.scores_total > 0 &&
            guide.choices.length <= 6
          "
          class="mb-3"
        >
          <div
            v-for="(choice, i) in guide.choices"
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
                {{ n(guide.scores[i]) }} {{ guide.space.symbol }}
              </span>
            </div>
            <div
              v-text="n((1 / guide.scores_total) * guide.scores[i], '0.[0]%')"
              class="absolute right-0 leading-[40px] mr-3 link-color"
            />
            <div
              :style="`width: ${
                (100 / guide.scores_total) * guide.scores[i]
              }%;`"
              class="bg-[color:var(--border-color)] rounded-md h-[40px]"
            />
          </div>
        </div>
        <div>
          <UiState :state="guide.state" slim class="mr-1" />
          {{ $t(`guides.states.${guide.state}`) }},
          <span
            v-if="guide.scores_state !== 'final'"
            v-text="$tc(period, [toNow(guide.end)])"
          />
          <span v-if="guide.scores_state === 'final'" class="mt-2">
            {{ n(guide.votes, '0,00') }} votes
          </span>
        </div>
      </div>
    </router-link>
  </div>
</template>
