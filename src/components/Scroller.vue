<script setup lang="ts">
import { useApp } from '@/composables/useApp';
import { useDomain } from '@/composables/useDomain';
import { useFollowSpace } from '@/composables/useFollowSpace';
import { useModal } from '@/composables/useModal';
import { useWeb3 } from '@/composables/useWeb3';
import { superAdmins } from '@/helpers/auth/superAdmins';
import { lsGet, lsSet } from '@/helpers/utils';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import Draggable from 'vuedraggable';
import Icon from '@/components/Icon.vue';
import { GuideType } from '@dodao/onboarding-schemas/models/GuideModel';
const { explore } = useApp();
const { domain } = useDomain();
const { loadFollows, followingSpaces } = useFollowSpace();
const { modalAccountOpen } = useModal();
const router = useRouter();
const { web3Account } = useWeb3();

const draggableSpaces = ref<any>([]);

function saveSpaceOrder() {
  if (web3Account.value)
    lsSet(`sidebarSpaceOrder.${web3Account.value.slice(0, 8).toLowerCase()}`, draggableSpaces.value);
}

const isSuperAdmin = computed(() => web3Account.value && superAdmins.includes(web3Account.value?.toLowerCase()));

const isNotProdEnv = import.meta.env.VITE_ENVIRONMENT !== 'prod';

const clickNewSpace = async () => {
  !web3Account.value ? (modalAccountOpen.value = true) : await router.push({ name: 'setup-dao' });
};

watch(web3Account, () => {
  loadFollows();
});

watch(followingSpaces, () => {
  draggableSpaces.value = followingSpaces.value;
  const sidebarSpaceOrder = lsGet(`sidebarSpaceOrder.${web3Account.value.slice(0, 8).toLowerCase()}`, []);
  // Order side bar and add new spaces to the end of the sidebar
  draggableSpaces.value.sort((a, b) => {
    if (!draggableSpaces.value.some(() => sidebarSpaceOrder.includes(a))) return 1;
    if (!draggableSpaces.value.some(() => sidebarSpaceOrder.includes(b))) return -1;
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
      <div class="flex flex-col h-[calc(100%-78px)] items-center space-y-2 pt-2">
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
              <UiUnreadIndicator class="group-hover:opacity-100 group-active:hidden" v-if="hasUnseenGuides" />
              <router-link
                :to="{
                  name: 'guides',
                  params: { guideType: GuideType.Onboarding, key: element }
                }"
              >
                <Token :space="explore.spaces[element]" symbolIndex="space" size="44" />
              </router-link>
            </div>
          </template>
        </Draggable>
        <button
          v-if="isNotProdEnv || isSuperAdmin"
          @click="clickNewSpace()"
          class="border w-[44px] h-[44px] rounded-lg flex justify-center items-center button"
        >
          <Icon size="20" name="plus" />
        </button>

        <div class="flex flex-col items-center space-y-2 justify-center !mb-2 !mt-auto py-2"></div>
      </div>
    </div>
  </div>
</template>
