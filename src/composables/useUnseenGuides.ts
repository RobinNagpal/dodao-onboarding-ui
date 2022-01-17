import { ref } from 'vue';
import { subgraphRequest } from '@snapshot-labs/snapshot.js/src/utils';
import { lsGet } from '@/helpers/utils';

const guideIds = ref([]);
const lastSeenGuide = ref({});

/**
 * Fixme: This will not work if one of the followed spaces has more than 100 guide created before
 * other spaces had guide.
 */
export function useUnseenGuides() {
  async function getGuideIds(followingSpaces) {
    if (followingSpaces[0]) {
      try {
        const activeGuide = await subgraphRequest(
          `${import.meta.env.VITE_HUB_URL}/graphql`,
          {
            guide: {
              __args: {
                first: 100,
                where: {
                  space_in: followingSpaces
                }
              },
              id: true,
              created: true,
              space: {
                id: true
              }
            }
          }
        );
        guideIds.value = activeGuide.guide;
      } catch (e) {
        console.log(e);
      }
    }
  }

  function updateLastSeenGuide(account) {
    if (account) {
      const walletId = account.slice(0, 8).toLowerCase();
      lastSeenGuide.value = lsGet(`lastSeenGuide.${walletId}`) || {};
    }
  }

  return {
    getGuideIds,
    updateLastSeenGuide,
    guideIds,
    lastSeenGuide
  };
}
