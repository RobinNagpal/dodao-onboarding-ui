<script setup lang="ts">
import UiButton from '@/components/Ui/Button.vue';
import UiDropdown from '@/components/Ui/Dropdown.vue';
import UiNamedToggle from '@/components/Ui/NamedToggle.vue';
import { useDomain } from '@/composables/useDomain';
import { useSpace } from '@/composables/useSpace';
import { useWeb3 } from '@/composables/useWeb3';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true }
});

const { isEthBlockchain } = useWeb3();

const { isAdmin } = useSpace(props.space);

const route = useRoute();
const router = useRouter();

const guideType = route.params.guideType;
const bundleType = route.params.bundleType;

function toggleGuidesAndBundles() {
  const typeParam =
    route.name === 'guides'
      ? { bundleType: guideType || bundleType }
      : { guideType: guideType || bundleType };

  router.push({
    name: route.name === 'guides' ? 'guideBundles' : 'guides',
    params: {
      ...typeParam,
      key: props.space.id
    }
  });
}

function createNewOnboardingBundle() {
  router.push({
    name: 'guideBundleCreate',
    params: { bundleType: guideType || bundleType, key: props.space.id }
  });
}

function editSpaceSettings() {
  router.push({ name: 'spaceEdit', params: { spaceId: props.space.id } });
}

function selectFromThreedotDropdown(e) {
  if (e === 'createNewOnboardingGuide') createNewOnboardingGuide();
  if (e === 'createNewOnboardingBundle') createNewOnboardingBundle();
  if (e === 'spaceSettings') editSpaceSettings();
}

function createNewOnboardingGuide() {
  router.push({
    name: 'guideCreate',
    params: { guideType: guideType || bundleType, key: props.space.id }
  });
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
    <div class="pl-3 flex nav-links">
      <router-link
        :to="{
          name: 'guides',
          params: { guideType: 'onboarding', key: space.id }
        }"
        :class="
          guideType === 'onboarding' ||
          bundleType === 'onboarding' ||
          ($route.name === 'spaceHome' && 'router-link-exact-active')
        "
      >
        <UiButton class="whitespace-nowrap">
          {{ $t('navigation.onboarding') }}
        </UiButton>
      </router-link>
      <router-link
        v-if="isEthBlockchain"
        :to="{
          name: 'guides',
          params: { guideType: 'how-to', key: space.id }
        }"
        :class="
          (guideType === 'how-to' || bundleType === 'how-to') &&
          'router-link-exact-active'
        "
      >
        <UiButton class="whitespace-nowrap">
          {{ $t('navigation.howTo') }}
        </UiButton>
      </router-link>
      <router-link
        :to="{
          name: 'guides',
          params: { guideType: 'level-up', key: space.id }
        }"
        :class="
          (guideType === 'level-up' || bundleType === 'level-up') &&
          'router-link-exact-active'
        "
      >
        <UiButton class="whitespace-nowrap">
          {{ $t('navigation.levelUp') }}
        </UiButton>
      </router-link>
    </div>
    <UiNamedToggle
      @update:modelValue="toggleGuidesAndBundles"
      :modelValue="$route.name === 'guideBundles'"
    />
    <div class="pt-2 pl-6">
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
