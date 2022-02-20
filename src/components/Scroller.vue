<script setup>
import { watch, onMounted, ref, watchEffect } from 'vue';
import draggable from 'vuedraggable';
import { useFollowSpace } from '@/composables/useFollowSpace';
import { useWeb3 } from '@/composables/useWeb3';
import { useApp } from '@/composables/useApp';
import { useDomain } from '@/composables/useDomain';
import { useUnseenProposals } from '@/composables/useUnseenProposals';
import { lsSet, lsGet } from '@/helpers/utils';
import { useModal } from '@/composables/useModal';
import { useRouter } from 'vue-router';

const { explore } = useApp();
const { domain } = useDomain();
const { loadFollows, followingSpaces } = useFollowSpace();
const { modalAccountOpen } = useModal();
const router = useRouter();
const { web3Account } = useWeb3();
const {
  proposalIds,
  getProposalIds,
  lastSeenProposals,
  updateLastSeenProposal
} = useUnseenProposals();

const draggableSpaces = ref([]);

function saveSpaceOrder() {
  if (web3Account.value)
    lsSet(
      `sidebarSpaceOrder.${web3Account.value.slice(0, 8).toLowerCase()}`,
      draggableSpaces.value
    );
}
const hasUnseenProposalsBySpace = space => {
  return proposalIds.value.some(p => {
    return (
      p.space.id === space && p.created > (lastSeenProposals.value[space] || 0)
    );
  });
};

const hasUnseenProposals = () =>
  followingSpaces.value.some(fs => hasUnseenProposalsBySpace(fs));

const clickNewSpace = async () => {
  !web3Account.value
    ? (modalAccountOpen.value = true)
    : await router.push({ name: 'setup-space' });
};

watch(web3Account, () => {
  loadFollows();
  updateLastSeenProposal(web3Account.value);
});

watch(followingSpaces, () => {
  draggableSpaces.value = followingSpaces.value;
  const sidebarSpaceOrder = lsGet(
    `sidebarSpaceOrder.${web3Account.value.slice(0, 8).toLowerCase()}`,
    []
  );
  // Order side bar and add new spaces to the end of the sidebar
  draggableSpaces.value.sort((a, b) => {
    if (!draggableSpaces.value.some(() => sidebarSpaceOrder.includes(a)))
      return 1;
    if (!draggableSpaces.value.some(() => sidebarSpaceOrder.includes(b)))
      return -1;
    return sidebarSpaceOrder.indexOf(a) - sidebarSpaceOrder.indexOf(b);
  });

  saveSpaceOrder();
});

watchEffect(() => getProposalIds(followingSpaces.value));

onMounted(() => {
  loadFollows();
});
</script>

<template>
  <div v-if="!domain" class="w-[68px] h-screen hidden sm:block m-0 fixed">
    <div class="flex flex-col h-full overflow-auto no-scrollbar">
      <div class="min-h-[78px] h-[78px] flex items-center justify-center"></div>
      <div
        class="flex flex-col h-[calc(100%-78px)] items-center space-y-2 pt-2"
      >
        <div class="flex items-center justify-center relative w-full">
          <UiUnreadIndicator v-if="hasUnseenProposals()" />
          <router-link :to="{ name: 'timeline' }">
            <UiSidebarButton>
              <Icon size="20" name="feed" />
            </UiSidebarButton>
          </router-link>
        </div>
        <draggable
          v-if="draggableSpaces.length > 0"
          v-model="draggableSpaces"
          :component-data="{ name: 'list' }"
          item-key="id"
          @update="saveSpaceOrder"
          class="w-full space-y-2"
        >
          <template #item="{ element }">
            <div class="w-full flex items-center justify-center relative group">
              <UiUnreadIndicator
                class="group-hover:opacity-100 group-active:hidden"
                v-if="hasUnseenProposalsBySpace(element)"
              />
              <router-link
                :to="{ name: 'spaceProposals', params: { key: element } }"
              >
                <Token
                  :space="explore.spaces[element]"
                  symbolIndex="space"
                  size="44"
                />
              </router-link>
            </div>
          </template>
        </draggable>

        <UiSidebarButton @click="clickNewSpace()"
          ><Icon size="20" name="plus"
        /></UiSidebarButton>

        <div
          class="flex flex-col items-center space-y-2 justify-center !mb-2 !mt-auto py-2"
        ></div>
      </div>
    </div>
  </div>
</template>
