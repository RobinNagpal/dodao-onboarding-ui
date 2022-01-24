<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getIpfsUrl, shorten } from '@/helpers/utils';
import { useModal } from '@/composables/useModal';
import { useDomain } from '@/composables/useDomain';
import { useApp } from '@/composables/useApp';
import { useWeb3 } from '@/composables/useWeb3';
import { useTxStatus } from '@/composables/useTxStatus';
import { useUserSkin } from '@/composables/useUserSkin';
import dodaoLogo from '@/assets/icons/logo/rectangular.svg';

const { pendingCount } = useTxStatus();
const { modalAccountOpen } = useModal();
const { env, domain } = useDomain();
const route = useRoute();

const { explore } = useApp();
const { login, web3 } = useWeb3();
const { toggleSkin, getSkinIcon } = useUserSkin();

const loading = ref(false);

const space = computed(() => {
  const key = domain || route.params.key;
  return explore.value.space?.[key];
});

function setTitle() {
  document.title = space.value?.name ?? 'DoDAO';
}

async function handleLogin(connector) {
  modalAccountOpen.value = false;
  loading.value = true;
  await login(connector);
  loading.value = false;
}

watch(space, () => {
  setTitle();
});

onMounted(() => setTitle());
</script>

<template>
  <Sticky>
    <div
      v-if="env === 'develop'"
      class="p-3 text-center bg-blue"
      style="color: white; font-size: 20px"
    >
      {{ $t('demoSite') }}
    </div>
    <nav
      id="topnav"
      class="w-full header-nav max-w-[1012px] mt-4 mx-auto p-4 rounded-md bg-white"
    >
      <Container class="max-w-[100%]">
        <div class="flex items-center" style="height: 78px">
          <div class="flex-auto flex items-center">
            <router-link
              :to="{ path: '/' }"
              class="flex items-center"
              style="font-size: 24px; padding-top: 4px"
            >
              <img
                :src="dodaoLogo"
                alt="arrow"
                class="logo arrow w-[190px]"
                :style="{ height: `56px` }"
              />
            </router-link>
          </div>
          <div :key="web3.account">
            <template v-if="$auth.isAuthenticated.value">
              <UiButton
                @click="modalAccountOpen = true"
                :loading="web3.authLoading"
                class="flex items-center float-left"
              >
                <UiAvatar
                  :imgsrc="
                    web3.profile?.image ? getIpfsUrl(web3.profile.image) : ''
                  "
                  :address="web3.account"
                  size="18"
                  class="-mr-1 sm:mr-2 md:mr-2 lg:mr-2 xl:mr-2 -ml-1"
                />
                <span
                  v-if="web3.profile?.name || web3.profile?.ens"
                  v-text="web3.profile.name || web3.profile.ens"
                  class="hidden sm:block"
                />
                <span
                  v-else
                  v-text="shorten(web3.account)"
                  class="hidden sm:block"
                />
              </UiButton>
            </template>
            <UiButton
              v-if="!$auth.isAuthenticated.value"
              @click="modalAccountOpen = true"
              :loading="loading || web3.authLoading"
              :aria-label="$t('connectWallet')"
            >
              <span class="hidden sm:block" v-text="$t('connectWallet')" />
              <Icon
                name="login"
                size="20"
                class="sm:hidden -ml-2 -mr-2 block align-text-bottom"
              />
            </UiButton>
            <UiSidebarButton
              v-if="!domain"
              @click="toggleSkin"
              class="float-right ml-2"
              :aria-label="$t('toggleSkin')"
            >
              <Icon size="20" class="link-color" :name="getSkinIcon()" />
            </UiSidebarButton>
          </div>
        </div>
      </Container>
    </nav>
    <div class="bg-blue text-white text-center py-2" v-if="pendingCount > 0">
      <UiLoading :fill-white="true" class="mr-2" />
      {{ $tc('delegate.pendingTransaction', pendingCount) }}
    </div>
    <teleport to="#modal">
      <ModalAccount
        :open="modalAccountOpen"
        @close="modalAccountOpen = false"
        @login="handleLogin"
      />
    </teleport>
  </Sticky>
</template>

<style scoped lang="scss">
.header-nav {
  box-shadow: 0 4px 16px 0 rgb(26 27 30 / 3%);
}
.logo {
  transition: transform 300ms ease, -webkit-transform 300ms ease;
}
.logo:hover {
  transform: scale(0.94);
}
</style>
