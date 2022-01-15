import { ref } from 'vue';
import { subgraphRequest } from '@snapshot-labs/snapshot.js/src/utils';
import { lsGet } from '@/helpers/utils';

const positionIds = ref([]);
const lastSeenPosition = ref({});

/**
 * Fixme: This will not work if one of the followed spaces has more than 100 position created before
 * other spaces had position.
 */
export function useUnseenPositions() {
  async function getPositionIds(followingSpaces) {
    if (followingSpaces[0]) {
      try {
        const activePosition = await subgraphRequest(
          `${import.meta.env.VITE_HUB_URL}/graphql`,
          {
            position: {
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
        positionIds.value = activePosition.position;
      } catch (e) {
        console.log(e);
      }
    }
  }

  function updateLastSeenPosition(account) {
    if (account) {
      const walletId = account.slice(0, 8).toLowerCase();
      lastSeenPosition.value = lsGet(`lastSeenPosition.${walletId}`) || {};
    }
  }

  return {
    getPositionIds,
    updateLastSeenPosition,
    positionIds,
    lastSeenPosition
  };
}
