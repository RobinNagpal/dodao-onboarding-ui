<script setup lang="ts">
import UiButton from '@/components/Ui/Button.vue';
import UiDropdown from '@/components/Ui/Dropdown.vue';
import { useDomain } from '@/composables/useDomain';
import { useSpace } from '@/composables/useSpace';
import { useWeb3 } from '@/composables/useWeb3';
import { bundleTypes } from '@/helpers/sign/bundleTypes';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { GuideType } from '@dodao/onboarding-schemas/models/GuideModel';

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true },
  guideType: String,
  bundleType: String
});

const { isEthBlockchain } = useWeb3();

const { isAdmin } = useSpace(props.space);

const route = useRoute();
const router = useRouter();

const guideType = route.params.guideType;
const bundleType = route.params.bundleType;

function createNewOnboardingGuide() {
  router.push({ name: 'guideCreate', params: { key: props.space.id } });
}

function createNewOnboardingBundle() {
  router.push({ name: 'guideBundleCreate', params: { key: props.space.id } });
}

function editSpaceSettings() {
  router.push({ name: 'spaceEdit', params: { spaceId: props.space.id } });
}

function selectFromThreedotDropdown(e) {
  if (e === 'createNewOnboardingGuide') createNewOnboardingGuide();
  if (e === 'createNewOnboardingBundle') createNewOnboardingBundle();
  if (e === 'spaceSettings') editSpaceSettings();
}

const { t } = useI18n();

const { domain } = useDomain();

const threeDotItems = computed(() => {
  const items: Array<{ text: string; action: string }> = [];

  // items.push({ text: t('guide.duplicate'), action: 'duplicate' });
  // items.push({ text: t('guide.delete'), action: 'delete' });
  items.push({ text: t('guides.new'), action: 'createNewOnboardingGuide' });
  items.push({
    text: t('guideBundles.new'),
    action: 'createNewOnboardingBundle'
  });

  if (!domain) {
    items.push({
      text: t('settings.header'),
      action: 'spaceSettings'
    });
  }
  return items;
});
</script>
<template>
  <div class="flex topnav-domain-navigation">
    <div class="px-3 flex nav-links">
      <router-link
        :to="{
          name: 'guides',
          params: { guideType: guideType || bundleType, key: space.id }
        }"
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
        :to="{
          name: 'guideBundles',
          params: { bundleType: guideType || bundleType, key: space.id }
        }"
        :class="$route.name === 'guideBundles' && 'router-link-exact-active'"
      >
        <UiButton class="whitespace-nowrap">
          {{ $t('guideBundles.header') }}
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
    <div class="pt-2">
      <UiDropdown
        top="2.5rem"
        right="1.3rem"
        class="float-right mr-2 topnav-domain-navigation-three-dots"
        :sub-menu-class="'z-10'"
        @select="selectFromThreedotDropdown"
        v-if="isAdmin"
        :items="threeDotItems"
      >
        <div class="pr-3">
          <Icon name="threedots" size="25" />
        </div>
      </UiDropdown>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.nav-links {
  a {
    button {
      border-radius: 0;
    }
  }
  a:first-child {
    button {
      -moz-border-radius-topleft: 0.5rem;
      -moz-border-radius-bottomleft: 0.5rem;

      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
    }
  }
  a:last-child {
    button {
      -moz-border-radius-topright: 0.5rem;
      -moz-border-radius-bottomright: 0.5rem;

      border-top-right-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }
  }

  .router-link-exact-active {
    button {
      color: white;
      background-color: var(--primary-color);
      border: 1px solid var(--border-color);

      &:hover {
        color: white;
        background-color: var(--primary-color);
        border: 1px solid var(--border-color);
        cursor: default;
      }
    }
  }
}
</style>
