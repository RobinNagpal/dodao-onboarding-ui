<script setup>
import { ref, watchEffect, onMounted } from 'vue';
import { useUnseenProposals } from '@/composables/useUnseenProposals';
import { useScrollMonitor } from '@/composables/useScrollMonitor';
import { useApp } from '@/composables/useApp';
import { useFollowSpace } from '@/composables/useFollowSpace';
import { useCategories } from '@/composables/useCategories';
import { shorten, setPageTitle, n } from '@/helpers/utils';

const { selectedCategory, orderedSpaces, orderedSpacesByCategory } = useApp();
const { followingSpaces } = useFollowSpace();
const { spacesPerCategory, categoriesOrderedBySpaceCount } = useCategories();

function selectCategory(c) {
  selectedCategory.value = c === selectedCategory.value ? '' : c;
}

const { getProposalIds } = useUnseenProposals();
watchEffect(() => getProposalIds(followingSpaces.value));

// Scroll
const loadBy = 16;
const limit = ref(loadBy);

const { endElement } = useScrollMonitor(() => (limit.value += loadBy));

onMounted(() => {
  setPageTitle('page.title.home');
});
</script>

<template>
  <div class="flex items-center wf-section mt-4 mx-auto">
    <div class="container-default w-container">
      <div class="flex items-center mb-4 mx-0">
        <UiButton class="pl-3 pr-0 w-full max-w-[420px] background-white">
          <SearchWithFilters />
        </UiButton>
        <UiDropdown
          class="ml-2 mr-auto z-10"
          top="3.5rem"
          right="1.25rem"
          @select="selectCategory($event)"
          :items="[
            {
              text: $tc('explore.categories.all'),
              action: '',
              count: orderedSpaces.length,
              selected: !selectedCategory
            },
            ...categoriesOrderedBySpaceCount
              .filter(c => spacesPerCategory[c])
              .map(c => ({
                text: $tc('explore.categories.' + c),
                action: c,
                count: spacesPerCategory[c],
                selected: selectedCategory === c
              }))
          ]"
        >
          <UiButton
            class="pr-3 whitespace-nowrap"
            :disabled="!orderedSpaces.length"
          >
            <Icon size="14" name="apps" class="mt-1 mr-2" />
            <span v-if="selectedCategory">
              {{ $tc('explore.categories.' + selectedCategory) }}
            </span>
            <span v-else>
              {{ $tc('explore.categories.all') }}
            </span>
            <Icon size="14" name="arrow-down" class="mt-1 mx-1" />
          </UiButton>
          <template v-slot:item="{ item }">
            <div class="flex">
              <span class="mr-3">{{ item.text }}</span>
              <span class="flex ml-auto mt-[-3px]">
                <UiCounter :counter="item.count" class="my-auto" />
              </span>
            </div>
          </template>
        </UiDropdown>
        <div class="ml-3 text-right hidden md:block whitespace-nowrap">
          {{ $tc('spaceCount', [n(orderedSpacesByCategory.length)]) }}
        </div>
      </div>
      <div class="_3-column-grid features-grid">
        <div
          role="listitem"
          class="card feature-card"
          v-for="space in orderedSpacesByCategory.slice(0, limit)"
          :key="space.id"
        >
          <router-link
            :to="{ name: 'spaceProposals', params: { key: space.id } }"
            class="card blog-card w-inline-block"
          >
            <div class="image-wrapper blog-card-thumbnail">
              <UiThumbnail
                :space="space"
                symbolIndex="space"
                size="350"
                class="mb-1"
                big_tile
              />
              <UiCounter
                v-if="space.activeProposals"
                :counter="space.activeProposals"
                class="absolute top-0 right-0 !bg-green"
              />
            </div>
            <div class="p-4 text-center">
              <h2 v-text="shorten(space.name, 16)" />

              <div class="flex flex-col">
                <div>
                  <div class="mb-[12px] text-color">
                    {{
                      $tc('members', space.followers, {
                        count: n(space.followers)
                      })
                    }}
                  </div>
                  <FollowButton class="!mb-0" :space="space" />
                </div>
              </div>
            </div>
            <div class="flex justify-end absolute top-4 right-4">
              <div
                class="badge post-category"
                v-for="category in space.categories || []"
                :key="category"
              >
                {{ category }}
              </div>
            </div>
          </router-link>
          <NoResults
            :block="true"
            v-if="Object.keys(orderedSpacesByCategory).length < 1"
          />
        </div>
      </div>

      <div ref="endElement" />
    </div>
  </div>
</template>
