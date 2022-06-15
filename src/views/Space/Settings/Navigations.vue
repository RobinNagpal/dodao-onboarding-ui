<script setup lang="ts">
import { useWeb3 } from '@/composables/useWeb3';
import { useRoute } from 'vue-router';
import SpaceSettingIcon from './SpaceSettingIcon.vue';

const route = useRoute();
const { isEthBlockchain, isOneBlockchain, isSolBlockchain } = useWeb3();

const navigations = [
  {
    name: 'generalSpaceSetting',
    text: 'General',
    icon: 'gear'
  },
  {
    name: 'discordSpaceSetting',
    text: 'Discord',
    icon: 'discord'
  },
  {
    name: 'gnosisSafeSetting',
    text: 'Gnosis Safe',
    icon: 'wallet'
  }
];

if (isEthBlockchain || isOneBlockchain || isSolBlockchain) {
  navigations.push({
    name: 'projectGalaxy',
    text: 'Project Galaxy',
    icon: 'projectGalaxy'
  });
}
</script>
<template>
  <div class="p-4 min-h-auto md:min-h-full bg-skin-header-bg rounded-3xl">
    <ul class="nav-list" role="menu">
      <router-link :key="nav.name" v-for="nav in navigations" :to="{ name: nav.name }">
        <li
          class="nav-item py-2 px-2 uppercase rounded-2xl flex items-center"
          :class="[{ active: route.name === nav.name }]"
        >
          <span class="icon">
            <SpaceSettingIcon :name="nav.icon" />
          </span>
          <span class="ml-2 mt-1">{{ nav.text }}</span>
        </li>
      </router-link>
    </ul>
  </div>
</template>
<style lang="scss">
.nav-item {
  @apply mb-2;
  color: var(--text-color);
  .icon {
    display: inline-block;
    svg {
      fill: var(--text-color);
      display: inline-block;
      height: 20px;
      width: 20px;
      line-height: 20px;
    }
  }

  &.active {
    background: rgba(255, 255, 255, 0.2);
    @apply font-bold text-primary;
    .icon {
      svg {
        fill: var(--primary-color);
      }
    }
  }
}
.nav-list {
  margin-left: 0;
  list-style-type: none;
}
</style>
