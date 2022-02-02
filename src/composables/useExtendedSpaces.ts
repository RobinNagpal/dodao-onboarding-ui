import { useApolloQuery } from '@/composables/useApolloQuery';
import { SPACES_QUERY } from '@/helpers/queries';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed, ref } from 'vue';

const extentedSpaces = ref<SpaceModel[]>([]);
const loading = ref(false);

export function useExtendedSpaces() {
  const { apolloQuery } = useApolloQuery();

  async function loadExtentedSpaces(id_in: string[] = []) {
    loading.value = true;
    try {
      const response = await apolloQuery(
        {
          query: SPACES_QUERY,
          variables: {
            id_in
          }
        },
        'spaces'
      );
      extentedSpaces.value = response;
      loading.value = false;
    } catch (e) {
      loading.value = false;
      console.error(e);
      return e;
    }
  }

  return {
    loadExtentedSpaces,
    extentedSpaces: computed(() => extentedSpaces.value),
    spaceLoading: computed(() => loading.value)
  };
}
