<script setup lang="ts">
import dodaoLogo from '@/assets/icons/logo/rectangular_new.svg';
import Icon from '@/components/Icon.vue';
import ModalAccount from '@/components/Modal/Account.vue';
import ModalBlockchains from '@/components/Modal/Blockchains.vue';
import SpaceNavigation from '@/components/Space/Navigation.vue';
import UiButton from '@/components/Ui/Button.vue';
import { WalletMultiButton } from '@/components/Wallet/Solana';
import { useApp } from '@/composables/useApp';
import { useDomain } from '@/composables/useDomain';
import { useModal } from '@/composables/useModal';
import { useTxStatus } from '@/composables/useTxStatus';
import { useWeb3 } from '@/composables/useWeb3';
import { useWeb3Wrapper } from '@/composables/useWeb3Wrapper';
import { getIpfsUrl, shorten } from '@/helpers/utils';
import { getCDNImageUrl } from '@/utils/platform/imageUtils';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const { pendingCount } = useTxStatus();
const { modalAccountOpen } = useModal();

const { env, domain } = useDomain();
const route = useRoute();

const { explore } = useApp();
const {
  web3,
  isEthBlockchain,
  isNearBlockchain,
  isOneBlockchain,
  isSolBlockchain
} = useWeb3();

const { loginWrapper } = useWeb3Wrapper();

const loading = ref(false);

const modalBlockchainsOpen = ref(false);

const space = computed(() => {
  const key = domain || route.params.key;
  return explore.value.spaces?.[key];
});

function setTitle() {
  document.title = space.value?.name ?? 'DoDAO';
}

async function handleLogin(connector) {
  modalAccountOpen.value = false;
  loading.value = true;
  await loginWrapper(connector);
  loading.value = false;
}

watch(space, () => {
  setTitle();
});

const logoUrl =
  domain && space.value?.avatar
    ? getCDNImageUrl(space.value?.avatar)
    : dodaoLogo;
onMounted(() => setTitle());
</script>

<template>
  <div
    v-if="env === 'develop'"
    class="p-3 text-center bg-blue header-main-wrapper"
    style="color: white; font-size: 20px"
  >
    {{ $t('demoSite') }}
  </div>
  <div id="topnav" class="header w-nav">
    <div class="header-main-wrapper">
      <Container class="max-w-[100%] container-default w-container">
        <div
          class="flex justify-between items-center header-wrapper flex-wrap"
          style="min-height: 78px"
        >
          <div
            class="flex items-center header-logo-wrapper w-nav-brand w--current top-nav-left pl-4"
          >
            <router-link
              :to="{ path: '/' }"
              class="flex items-center"
              style="font-size: 24px; padding-top: 4px"
            >
              <img :src="logoUrl" alt="arrow" class="logo arrow h-[60px]" />
            </router-link>
          </div>
          <div v-if="!domain" class="top-nav-middle flex justify-center">
            <UiButton
              @click="modalBlockchainsOpen = true"
              class="flex items-center float-left"
            >
              <span class="whitespace-nowrap">All DAOs</span>
            </UiButton>
          </div>
          <div v-else class="top-nav-middle flex justify-center">
            <SpaceNavigation :space="space" />
          </div>
          <div :key="web3.account" class="flex top-nav-right justify-end pr-4">
            <template
              v-if="
                (isEthBlockchain || isNearBlockchain || isOneBlockchain) &&
                $auth.isAuthenticated.value
              "
            >
              <UiButton
                @click="modalAccountOpen = true"
                :loading="web3.authLoading"
                class="flex items-center float-right"
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
            <WalletMultiButton v-if="isSolBlockchain" />
            <UiButton
              v-if="!isSolBlockchain && !$auth.isAuthenticated.value"
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
          </div>
        </div>
      </Container>
    </div>
  </div>
  <div class="bg-blue text-white text-center py-2" v-if="pendingCount > 0">
    <UiLoading :fill-white="true" class="mr-2" />
    {{ $tc('delegate.pendingTransaction', pendingCount) }}
  </div>
  <teleport to="#modal">
    <ModalAccount
      :open="
        (isEthBlockchain || isNearBlockchain || isOneBlockchain) &&
        modalAccountOpen
      "
      @close="modalAccountOpen = false"
      @login="handleLogin"
    />
    <ModalBlockchains
      :open="modalBlockchainsOpen"
      @close="modalBlockchainsOpen = false"
    />
  </teleport>
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
