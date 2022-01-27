import { useApp } from '@/composables/useApp';
import { useClient } from '@/composables/useClient';
import { useStore } from '@/composables/useStore';
import { getGuide } from '@/helpers/snapshot';
import { GuideModel } from '@/models/GuideModel';
import { SpaceModel } from '@/models/SpaceModel';
import { emptyGuide } from '@/views/Guide/EmptyGuide';
import orderBy from 'lodash/orderBy';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

export function useGuide(uuid: string | null, space: SpaceModel, notify: any) {
  const { send } = useClient();
  const router = useRouter();
  const { t } = useI18n();
  const { getExplore } = useApp();
  const { store } = useStore();

  const emptyGuideModel = emptyGuide(space);
  const guideRef = ref<GuideModel>(emptyGuideModel);
  const guideLoaded = ref<boolean>(false);

  const steps = computed(() => {
    return guideRef.value.steps;
  });

  const activeStepId = ref();

  async function initialize() {
    if (uuid) {
      const guide = await getGuide(uuid);
      guideRef.value = {
        ...guide,
        metadata: { network: space.network },
        space: space.id
      };
      const minOrder = Math.min(...steps.value.map(step => step.order));
      activeStepId.value = steps.value.find(
        step => step.order === minOrder
      )?.uuid;

      guideLoaded.value = true;
    } else {
      activeStepId.value = emptyGuideModel.steps[0].uuid;
      guideLoaded.value = true;
    }
  }
  function setActiveStep(uuid) {
    activeStepId.value = uuid;
  }

  function updateStep(step) {
    guideRef.value.steps = guideRef.value.steps.map(s => {
      if (s.uuid === step.uuid) {
        return step;
      } else {
        return s;
      }
    });
  }

  function moveStepUp(stepUuid) {
    const stepIndex = guideRef.value.steps.findIndex(s => s.uuid === stepUuid);
    guideRef.value.steps[stepIndex - 1].order = stepIndex;
    guideRef.value.steps[stepIndex].order = stepIndex - 1;

    guideRef.value.steps = orderBy(guideRef.value.steps, 'order');
  }

  function moveStepDown(stepUuid) {
    const stepIndex = guideRef.value.steps.findIndex(s => s.uuid === stepUuid);
    guideRef.value.steps[stepIndex + 1].order = stepIndex;
    guideRef.value.steps[stepIndex].order = stepIndex + 1;

    guideRef.value.steps = orderBy(guideRef.value.steps, 'order');
  }

  function addStep() {
    guideRef.value.steps = [
      ...guideRef.value.steps,
      {
        uuid: uuidv4(),
        name: `Step ${guideRef.value.steps.length + 1}`,
        content: '',
        order: guideRef.value.steps.length,
        questions: []
      }
    ];
  }

  async function handleSubmit() {
    guideRef.value.metadata['network'] = space?.network;
    const result = await send(space, 'guide', guideRef.value);
    console.log(result);
    if (result.id) {
      getExplore();
      store.space.guides = [];
      notify(['green', t('notify.guideCreated')]);
      router.push({
        name: 'guide',
        params: {
          key: space.id,
          id: result.id
        }
      });
    }
  }

  return {
    activeStepId,
    addStep,
    guideLoaded,
    guideRef,
    handleSubmit,
    initialize,
    moveStepUp,
    moveStepDown,
    setActiveStep,
    updateStep
  };
}
