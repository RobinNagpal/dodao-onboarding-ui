<script setup>
import { onMounted, ref } from 'vue';
import { useScrollMonitor } from '@/composables/useScrollMonitor';
import { useApp } from '@/composables/useApp';
import { useCategories } from '@/composables/useCategories';
import { n, setPageTitle, shorten } from '@/helpers/utils';
import { useWeb3 } from '@/composables/useWeb3';

const { selectedCategory, orderedSpaces, orderedSpacesByCategory } = useApp();
const { spacesPerCategory, categoriesOrderedBySpaceCount } = useCategories();
const { isEthBlockchain, isOneBlockchain } = useWeb3();

function selectCategory(c) {
  selectedCategory.value = c === selectedCategory.value ? '' : c;
}

// Scroll
const loadBy = 16;
const limit = ref(loadBy);

const { endElement } = useScrollMonitor(() => (limit.value += loadBy));

onMounted(() => {
  setPageTitle('page.title.home');
});
</script>

<template>
  <div class="flex items-center wf-section mt-6 mx-auto">
    <div class="container-default w-container">
      <div class="flex items-center mb-6 mx-0">
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
                <UiCounter
                  :counter="item.count"
                  class="my-auto category-counter"
                />
              </span>
            </div>
          </template>
        </UiDropdown>
        <div class="ml-3 text-right hidden md:block whitespace-nowrap">
          {{ $tc('daoCount', [n(orderedSpacesByCategory.length)]) }}
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
            :to="{ name: 'guides', params: { key: space.id } }"
            class="card blog-card w-inline-block"
          >
            <div class="image-wrapper blog-card-thumbnail">
              <UiThumbnail
                :src="space.avatar"
                :entityId="space.id"
                :title="space.name"
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
            <div class="pt-2 pb-4 px-4 text-center">
              <h2
                v-text="shorten(space.name, 32)"
                class="text-base font-bold leading-normal whitespace-nowrap overflow-hidden text-ellipsis"
              />
              <div class="h-[85px] overflow-hidden text-xs">
                {{ space.mission }}
              </div>
              <div
                class="flex flex-col"
                v-if="isEthBlockchain || isOneBlockchain"
              >
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
            <div class="flex flex-wrap justify-end absolute top-2 right-2">
              <div
                class="badge post-category mb-1 flex-wrap"
                v-for="category in space.categories || []"
                :key="category"
              >
                {{ $t('category.' + category) }}
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
<style scoped lang="scss">
.category-counter {
  line-height: 20px;
}
</style>
