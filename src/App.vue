<script setup>
import { onMounted, provide, watch } from 'vue';
import { useModal } from '@/composables/useModal';
import { useI18n } from '@/composables/useI18n';
import { useApp } from '@/composables/useApp';
import { useWeb3 } from '@/composables/useWeb3';
import { useNotifications } from '@/composables/useNotifications';

const { loadLocale } = useI18n();
const { modalOpen } = useModal();
const { init, app, appSkin } = useApp();
const { web3 } = useWeb3();
const { notify } = useNotifications();

provide('web3', web3);
provide('notify', notify);

onMounted(async () => {
  await loadLocale();
  await init();
});

watch(modalOpen, val => {
  const el = document.body;
  el.classList[val ? 'add' : 'remove']('overflow-hidden');
});
</script>

<template>
  <div
    :class="appSkin"
    class="pb-6 font-serif text-base min-h-screen text-skin-text antialiased"
  >
    <UiLoading v-if="app.loading || !app.init" class="overlay big" />
    <div v-else>
      <div class="page-wrapper">
        <Topnav />
        <div class="flex mt-[64px]">
          <Scroller />
          <router-view :key="$route.path" class="flex-auto route-view" />
        </div>
      </div>
    </div>
    <div id="modal" />
    <Notifications />
  </div>
</template>
