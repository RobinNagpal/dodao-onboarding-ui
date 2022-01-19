import { useApp } from '@/composables/useApp';
import categories from '@/helpers/categories.json';
import { computed } from 'vue';

export function useCategories() {
  const { orderedSpaces } = useApp();

  // count spaces per category
  const spacesPerCategory = computed(() => {
    const spaces = orderedSpaces.value.reduce((counters, space) => {
      if (!space.private) {
        space.categories?.forEach((c: any) => counters[c]++);
        return counters;
      }
    }, Object.fromEntries(categories.map(c => [c, 0])));
    return spaces;
  });

  const categoriesOrderedBySpaceCount = computed(() => {
    return categories.sort(
      (a, b) => spacesPerCategory.value[b] - spacesPerCategory.value[a]
    );
  });

  return {
    categories,
    spacesPerCategory,
    categoriesOrderedBySpaceCount
  };
}
