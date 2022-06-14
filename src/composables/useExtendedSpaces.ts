import { useApolloQuery } from '@/composables/useApolloQuery';
import { ExtendedSpace_space } from '@/graphql/generated/graphqlDocs';
import { ExtendedSpace } from '@/graphql/space/extendedSpace.graphql';
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
      extentedSpaces.value = [
        ...response.map(space => ({
          ...space,
          extendedSpace: true
        }))
      ];
      loading.value = false;
    } catch (e) {
      loading.value = false;
      console.error(e);
      return e;
    }
  }

  async function loadExtendedSpace(spaceId: string): Promise<ExtendedSpace_space> {
    loading.value = true;
    try {
      const response = await apolloQuery(
        {
          query: ExtendedSpace,
          variables: {
            spaceId
          }
        },
        'space'
      );

      console.log('loadExtendedSpace', response);
      const spaceInfo = { ...response, extendedSpace: true };
      if (extentedSpaces.value.some(space => space.id === spaceId)) {
        extentedSpaces.value = extentedSpaces.value.map(space => (space.id === spaceId ? spaceInfo : space));
      } else {
        extentedSpaces.value = [...extentedSpaces.value, spaceInfo];
      }

      loading.value = false;
      return spaceInfo;
    } catch (e) {
      loading.value = false;
      console.error(e);
      throw e;
    }
  }

  return {
    loadExtendedSpace,
    loadExtentedSpaces,
    extentedSpaces: computed(() => extentedSpaces.value),
    spaceLoading: computed(() => loading.value)
  };
}
