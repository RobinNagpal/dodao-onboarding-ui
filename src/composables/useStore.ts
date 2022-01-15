import { reactive } from 'vue';

const store = reactive({
  space: {
    proposals: [],
    positions: [],
    filterBy: 'all'
  },
  timeline: {
    proposals: [],
    positions: [],
    filterBy: 'all'
  }
});

export function useStore() {
  return { store };
}
