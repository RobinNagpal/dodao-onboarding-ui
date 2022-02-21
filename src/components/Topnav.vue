<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getIpfsUrl, shorten } from '@/helpers/utils';
import { useModal } from '@/composables/useModal';
import { useDomain } from '@/composables/useDomain';
import { useApp } from '@/composables/useApp';
import { useWeb3 } from '@/composables/useWeb3';
import { useTxStatus } from '@/composables/useTxStatus';
import { useUserSkin } from '@/composables/useUserSkin';
import dodaoLogo from '@/assets/icons/logo/rectangular_new.svg';

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
        <div class="flex items-center header-wrapper" style="height: 78px">
          <div
            class="flex-auto flex items-center header-logo-wrapper w-nav-brand w--current"
          >
            <router-link
              :to="{ path: '/' }"
              class="flex items-center"
              style="font-size: 24px; padding-top: 4px"
            >
              <img :src="dodaoLogo" alt="arrow" class="logo arrow w-[190px]" />
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
              <Icon size="20" :name="getSkinIcon()" />
            </UiSidebarButton>
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
      :open="modalAccountOpen"
      @close="modalAccountOpen = false"
      @login="handleLogin"
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
