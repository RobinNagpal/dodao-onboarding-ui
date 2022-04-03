import { useApp } from '@/composables/useApp';
import { useClient } from '@/composables/useClient';
import { useStore } from '@/composables/useStore';
import { useWeb3 } from '@/composables/useWeb3';
import { getGuideBundle } from '@/helpers/snapshot';
import { GuideBundleError } from '@/types/error';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import orderBy from 'lodash/orderBy';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { emptyGuideBundle, TempGuideBundleInput } from './EmptyGuideBundle';

export function useEditGuideBundle(
  uuid: string | null,
  space: SpaceModel,
  notify: any
) {
  const { send } = useClient();
  const router = useRouter();
  const { t } = useI18n();
  const { getExplore } = useApp();
  const { store } = useStore();
  const { web3 } = useWeb3();

  const emptyGuideBundleModel = emptyGuideBundle(web3.value.account, space);
  const guideBundleRef = ref<TempGuideBundleInput>(emptyGuideBundleModel);
  const guideBundleErrors = ref<GuideBundleError>({ bundleGuides: {} });
  const guideBundleLoaded = ref<boolean>(false);

  const guideBundleCreating = ref(false);

  async function initialize() {
    if (uuid) {
      const guideBundle = await getGuideBundle(uuid);
      guideBundleRef.value = {
        ...guideBundle,
        from: web3.value.account,
        space: space.id,
        thumbnail: guideBundle.thumbnail || undefined,
        discordWebhook: guideBundle.discordWebhook || undefined
      };
    }

    guideBundleLoaded.value = true;
  }

  function addEmptyBundleGuideInput() {
    guideBundleRef.value.bundleGuides = [
      ...guideBundleRef.value.bundleGuides,
      {
        uuid: uuidv4(),
        order: guideBundleRef.value.bundleGuides.length
      }
    ];
  }
  function selectGuide(uuid: string, guideUuid: string) {
    guideBundleRef.value.bundleGuides = guideBundleRef.value.bundleGuides.map(
      g => {
        if (g.uuid === uuid) {
          return { ...g, guideUuid };
        } else {
          return g;
        }
      }
    );
  }

  function moveGuideUp(guideInputUuid: string) {
    const guideIndex = guideBundleRef.value.bundleGuides.findIndex(
      s => s.uuid === guideInputUuid
    );
    guideBundleRef.value.bundleGuides[guideIndex - 1].order = guideIndex;
    guideBundleRef.value.bundleGuides[guideIndex].order = guideIndex - 1;

    guideBundleRef.value.bundleGuides = orderBy(
      guideBundleRef.value.bundleGuides,
      'order'
    );
  }

  function removeGuideInput(guideInputUuid: string) {
    const filteredGuides = guideBundleRef.value.bundleGuides.filter(
      s => s.uuid !== guideInputUuid
    );
    guideBundleRef.value.bundleGuides = filteredGuides.map(
      (guideInput, index) => ({ ...guideInput, order: index })
    );
  }

  function moveGuideDown(guideUuid: string) {
    const guideIndex = guideBundleRef.value.bundleGuides.findIndex(
      s => s.uuid === guideUuid
    );
    guideBundleRef.value.bundleGuides[guideIndex + 1].order = guideIndex;
    guideBundleRef.value.bundleGuides[guideIndex].order = guideIndex + 1;

    guideBundleRef.value.bundleGuides = orderBy(
      guideBundleRef.value.bundleGuides,
      'order'
    );
  }

  async function handleSubmit() {
    guideBundleCreating.value = true;
    const result = await send(space, 'guideBundle', guideBundleRef.value);
    if (result?.id) {
      await getExplore();
      store.space.guideBundles = [];
      notify(['green', t('notify.guideBundleCreated')]);
      await router.push({
        name: 'guideBundle',
        params: {
          key: space.id,
          uuid: result.uuid
        }
      });
    }
    guideBundleCreating.value = false;
  }

  return {
    addEmptyBundleGuideInput,
    guideBundleCreating,
    guideBundleLoaded,
    guideBundleRef,
    guideBundleErrors,
    handleSubmit,
    initialize,
    moveGuideUp,
    moveGuideDown,
    removeGuideInput,
    selectGuide
  };
}
