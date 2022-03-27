import { GuideSubmissionsQuery_guideSubmissions } from '@/graphql/generated/graphqlDocs';
import { getGuideSubmissions } from '@/helpers/snapshot';
import { ref } from 'vue';

export function useViewGuideSubmissions(uuid: string) {
  const guideSubmissionsRef = ref<GuideSubmissionsQuery_guideSubmissions[]>([]);
  const submissionsLoadedRef = ref<boolean>(false);

  async function initialize() {
    guideSubmissionsRef.value = await getGuideSubmissions(uuid);
    submissionsLoadedRef.value = true;
  }

  return {
    guideSubmissionsRef,
    initialize,
    submissionsLoadedRef
  };
}
