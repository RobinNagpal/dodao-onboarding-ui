<script setup lang="ts">
import UiButton from '@/components/Ui/Button.vue';
import { useSpace } from '@/composables/useSpace';
import { useWeb3 } from '@/composables/useWeb3';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { PropType } from 'vue';

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true }
});

const { isEthBlockchain } = useWeb3();

const { isAdmin } = useSpace(props.space);
</script>
<template>
  <div class="px-3 flex nav-links">
    <router-link
      :to="{ name: 'guides', params: { key: space.id } }"
      :class="
        $route.name === 'guides' ||
        ($route.name === 'spaceHome' && 'router-link-exact-active')
      "
    >
      <UiButton class="whitespace-nowrap">
        {{ $t('guides.header') }}
      </UiButton>
    </router-link>
    <router-link
      v-if="isEthBlockchain"
      :to="{ name: 'guideBundles', params: { key: space.id } }"
      :class="$route.name === 'guideBundles' && 'router-link-exact-active'"
    >
      <UiButton class="whitespace-nowrap">
        {{ $t('guideBundles.header') }}
      </UiButton>
    </router-link>
    <router-link
      v-if="isAdmin"
      :to="{ name: 'guideCreate', params: { key: space.id } }"
    >
      <UiButton class="whitespace-nowrap">
        {{ $t('guides.new') }}
      </UiButton>
    </router-link>
    <router-link
      v-if="isAdmin && isEthBlockchain"
      :to="{ name: 'guideBundleCreate', params: { key: space.id } }"
    >
      <UiButton class="whitespace-nowrap">
        {{ $t('guideBundles.new') }}
      </UiButton>
    </router-link>
    <router-link
      v-if="isAdmin"
      :to="{ name: 'spaceEdit', params: { spaceId: space.id, space: space } }"
    >
      <UiButton class="whitespace-nowrap">
        {{ $t('settings.header') }}
      </UiButton>
    </router-link>
    <router-link
      :to="{ name: 'spaceAbout', params: { key: space.id } }"
      :class="$route.name === 'spaceAbout' && 'router-link-exact-active'"
    >
      <UiButton class="whitespace-nowrap">
        {{ $t('about') }}
      </UiButton>
    </router-link>
  </div>
</template>
<style lang="scss" scoped>
.nav-links {
  a {
    margin: 8px;
  }

  .router-link-exact-active {
    button {
      color: white;
      background-color: var(--primary-color);
      border: 1px solid var(--primary-color);

      &:hover {
        color: white;
        background-color: var(--primary-color);
        border: 1px solid var(--primary-color);
        cursor: default;
      }
    }
  }
}
</style>
