import { GuideSubmissionsQuery_guideSubmissions } from '@/graphql/generated/graphqlDocs';
import { getGuideSubmissions } from '@/helpers/snapshot';
import { ref } from 'vue';

export function useViewGuideSubmissions(uuid: string) {
  const guideSubmissionsRef = ref<GuideSubmissionsQuery_guideSubmissions[]>([]);
  const submissionsLoadedRef = ref<boolean>(false);
  const onResultCallBacks = ref<Function[]>([]);

  async function initialize() {
    guideSubmissionsRef.value = await getGuideSubmissions(uuid);
    submissionsLoadedRef.value = true;
    for (let i = 0; i < onResultCallBacks.value.length; i++) {
      onResultCallBacks.value[i](guideSubmissionsRef.value);
    }
  }

  function onResult(callback: Function) {
    onResultCallBacks.value.push(callback);
  }

  return {
    onResult,
    guideSubmissionsRef,
    initialize,
    submissionsLoadedRef
  };
}
