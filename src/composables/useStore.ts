import { reactive } from 'vue';

const store = reactive({
  space: {
    proposals: [],
    guides: [],
    guideBundles: [],
    filterBy: 'all'
  },
  timeline: {
    proposals: [],
    guides: [],
    guideBundles: [],
    filterBy: 'all'
  }
});

export function useStore() {
  return { store };
}
