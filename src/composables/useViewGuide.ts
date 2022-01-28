import { getGuide } from '@/helpers/snapshot';
import { GuideModel } from '@dodao/onboarding-schemas/models/GuideModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { ref } from 'vue';

export function useViewGuide(uuid: string) {
  const guideRef = ref<GuideModel>();
  const guideLoaded = ref<boolean>(false);

  const activeStepId = ref();

  async function initialize() {
    const guide = await getGuide(uuid);
    guideRef.value = {
      ...guide,
      space: guide.space as unknown as SpaceModel
    };
    const minOrder = Math.min(...guide.steps.map(step => step.order));
    activeStepId.value = guide.steps.find(
      step => step.order === minOrder
    )?.uuid;

    guideLoaded.value = true;
  }

  function setActiveStep(uuid) {
    activeStepId.value = uuid;
  }

  return {
    activeStepId,
    guideLoaded,
    guideRef,
    initialize,
    setActiveStep
  };
}
