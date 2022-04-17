import verifiedSpacesCategories from '@/../snapshot-spaces/spaces/categories.json';
import verified from '@/../snapshot-spaces/spaces/verified.json';
import { useFollowSpace } from '@/composables/useFollowSpace';
import { useSpaceSkin } from '@/composables/useSpaceSkin';
import { useWeb3Wrapper } from '@/composables/useWeb3Wrapper';
import { getBlockchain, getNetworks } from '@/helpers/network';
import { getInstance } from '@/utils/auth/auth';
import orderBy from 'lodash/orderBy';
import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const networks = getNetworks();

const state = reactive({
  init: false,
  loading: false
});

const spaces = ref({});
const strategies = ref({});
const explore: any = ref({});
const appSkin: any = ref('default');

export function useApp() {
  const route = useRoute();
  const { loginWrapper } = useWeb3Wrapper();
  const { followingSpaces } = useFollowSpace();
  const { spaceIdForDomain } = useSpaceSkin();

  async function init() {
    const auth = getInstance();
    state.loading = true;
    await getExplore();
    initSkin();

    // Auto connect with gnosis-connector when inside gnosis-safe iframe
    const connector = await auth.getConnector();

    console.log('connector', connector);

    if (connector) {
      try {
        loginWrapper(connector);
      } catch (e) {
        console.error(e);
      }
    }

    state.init = true;
    state.loading = false;
  }

  async function getExplore() {
    const viteHubUrl = import.meta.env.VITE_HUB_URL;
    console.log('viteHubUrl', viteHubUrl);
    try {
      const exploreObj: any = await fetch(
        `${viteHubUrl}/api/explore?blockchain=${getBlockchain().toString()}`
      ).then(res => res.json());

      console.log('getExplore', exploreObj);
      exploreObj.spaces = Object.fromEntries(
        Object.entries(exploreObj.spaces).map(([id, space]: any) => {
          // map manually selected categories for verified spaces that don't have set their categories yet
          // set to empty array if space.categories is missing
          space.categories = space.categories?.length
            ? space.categories
            : verifiedSpacesCategories[id]?.length
            ? verifiedSpacesCategories[id]
            : [];

          return [id, { id, ...space }];
        })
      );
      explore.value = exploreObj;

      return exploreObj;
    } catch (e) {
      console.error(e);
      explore.value = {};
    }

    return;
  }

  function initSkin() {
    const spaceWithSkin: any = spaceIdForDomain
      ? explore.value.spaces[spaceIdForDomain]
      : null;

    const selectedSkin = spaceWithSkin?.skin || 'dodao';
    appSkin.value = selectedSkin;
    console.log('selected skin', selectedSkin);
    document.body.classList.add(selectedSkin);
  }

  const selectedCategory = ref('');

  const testnetNetworks = Object.entries(networks)
    .filter((network: any) => network[1].testnet)
    .map(([id]) => id);

  const orderedSpaces = computed(() => {
    const network = route.query.network || '';
    const q = route.query.q?.toString() || '';
    const spaces =
      (explore.value.spaces && Object.keys(explore.value.spaces)) || [];

    const list = spaces
      .map(key => {
        const following = followingSpaces.value.some(s => s === key);
        const followers = explore.value.spaces[key].followers ?? 0;
        // const voters1d = explore.value.spaces[key].voters_1d ?? 0;
        const followers1d = explore.value.spaces[key].followers_1d ?? 0;
        // const proposals1d = explore.value.spaces[key].proposals_1d ?? 0;
        const isVerified = verified[key] || 0;
        let score = followers1d + followers / 4;
        if (isVerified === 1) score = score * 2;
        const testnet = testnetNetworks.includes(
          explore.value.spaces[key].network
        );
        return {
          ...explore.value.spaces[key],
          following,
          followers,
          private: explore.value.spaces[key].private ?? false,
          score,
          testnet
        };
      })
      .filter(space => !space.private && verified[space.id] !== -1)
      .filter(space => space.network === network || !network)
      .filter(space =>
        JSON.stringify(space).toLowerCase().includes(q.toLowerCase())
      );

    return orderBy(
      list,
      ['following', 'testnet', 'score'],
      ['desc', 'asc', 'desc']
    );
  });

  const orderedSpacesByCategory = computed(() =>
    orderedSpaces.value.filter(
      space =>
        !selectedCategory.value ||
        (space.categories && space.categories.includes(selectedCategory.value))
    )
  );

  return {
    appSkin,
    init,
    getExplore,
    app: computed(() => state),
    spaces: computed(() => spaces.value),
    strategies: computed(() => strategies.value),
    explore: computed(() => explore.value),
    orderedSpaces,
    orderedSpacesByCategory,
    selectedCategory
  };
}
