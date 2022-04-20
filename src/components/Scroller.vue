<script setup lang="ts">
import { watch, onMounted, ref, computed } from 'vue';
import Draggable from 'vuedraggable';
import { useFollowSpace } from '@/composables/useFollowSpace';
import { useWeb3 } from '@/composables/useWeb3';
import { useApp } from '@/composables/useApp';
import { useDomain } from '@/composables/useDomain';
import { lsSet, lsGet } from '@/helpers/utils';
import { useModal } from '@/composables/useModal';
import superAdmins from '@/helpers/jsons/super_admins.json';
import { useRouter } from 'vue-router';

const { explore } = useApp();
const { domain } = useDomain();
const { loadFollows, followingSpaces } = useFollowSpace();
const { modalAccountOpen } = useModal();
const router = useRouter();
const { web3Account } = useWeb3();

const draggableSpaces = ref<any>([]);

function saveSpaceOrder() {
  if (web3Account.value)
    lsSet(
      `sidebarSpaceOrder.${web3Account.value.slice(0, 8).toLowerCase()}`,
      draggableSpaces.value
    );
}

const isSuperAdmin = computed(
  () =>
    web3Account.value && superAdmins.includes(web3Account.value?.toLowerCase())
);

const isNotProdEnv = import.meta.env.VITE_ENVIRONMENT !== 'prod';

const clickNewSpace = async () => {
  !web3Account.value
    ? (modalAccountOpen.value = true)
    : await router.push({ name: 'setup-dao' });
};

watch(web3Account, () => {
  loadFollows();
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

onMounted(() => {
  loadFollows();
});

const hasUnseenGuides = false;
</script>

<template>
  <div v-if="!domain" class="w-[68px] h-screen hidden sm:block m-0 fixed z-10">
    <div class="flex flex-col h-full overflow-auto no-scrollbar">
      <div class="min-h-[78px] h-[78px] flex items-center justify-center"></div>
      <div
        class="flex flex-col h-[calc(100%-78px)] items-center space-y-2 pt-2"
      >
        <Draggable
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
                v-if="hasUnseenGuides"
              />
              <router-link :to="{ name: 'guides', params: { key: element } }">
                <Token
                  :space="explore.spaces[element]"
                  symbolIndex="space"
                  size="44"
                />
              </router-link>
            </div>
          </template>
        </Draggable>

        <UiSidebarButton
          v-if="isNotProdEnv || isSuperAdmin"
          @click="clickNewSpace()"
          ><Icon size="20" name="plus"
        /></UiSidebarButton>

        <div
          class="flex flex-col items-center space-y-2 justify-center !mb-2 !mt-auto py-2"
        ></div>
      </div>
    </div>
  </div>
</template>
