<script setup lang="ts">
import SpaceNavigationLink from '@/components/Space/NavigationLink.vue';
import UiDropdown from '@/components/Ui/Dropdown.vue';
import UiNamedToggle from '@/components/Ui/NamedToggle.vue';
import { useDomain } from '@/composables/useDomain';
import { useSpace } from '@/composables/useSpace';
import { GuideType } from '@dodao/onboarding-schemas/models/GuideModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true }
});

const { isAdmin } = useSpace(props.space);

const route = useRoute();
const router = useRouter();

const guideType = computed(() => route.params.guideType);
const bundleType = computed(() => route.params.bundleType);

const guideOrBundleType = computed(
  () =>
    route.params.guideType || route.params.bundleType || GuideType.Onboarding
);

const routeName = computed(() => route.name);

function toggleGuidesAndBundles() {
  const typeParam =
    routeName.value === 'guides'
      ? { bundleType: guideOrBundleType.value }
      : { guideType: guideOrBundleType.value };

  router.push({
    name: routeName.value === 'guides' ? 'guideBundles' : 'guides',
    params: {
      ...typeParam,
      key: props.space.id
    }
  });
}

function createNewBundle() {
  router.push({
    name: 'guideBundleCreate',
    params: {
      bundleType: guideOrBundleType.value,
      key: props.space.id
    }
  });
}

function editSpaceSettings() {
  router.push({
    name: 'spaceEdit',
    params: { spaceId: props.space.id, key: props.space.id }
  });
}

function selectFromThreedotDropdown(e) {
  if (e === 'createNewGuide') createNewGuide();
  if (e === 'createNewBundle') createNewBundle();
  if (e === 'spaceSettings') editSpaceSettings();
}

function createNewGuide() {
  router.push({
    name: 'guideCreate',
    params: { guideType: guideOrBundleType.value, key: props.space.id }
  });
}

const { t } = useI18n();

const { domain } = useDomain();

const threeDotItems = computed(() => {
  const items: Array<{ text: string; action: string }> = [];

  items.push({ text: t('guides.new'), action: 'createNewGuide' });
  items.push({
    text: t('guideBundles.new'),
    action: 'createNewBundle'
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
      <SpaceNavigationLink
        :space="space"
        :guide-or-bundle-type="guideOrBundleType"
        :category-type="'onboarding'"
      />
      <SpaceNavigationLink
        :space="space"
        :guide-or-bundle-type="guideOrBundleType"
        :category-type="'how-to'"
      />
      <SpaceNavigationLink
        :space="space"
        :guide-or-bundle-type="guideOrBundleType"
        :category-type="'level-up'"
      />
    </div>
    <UiNamedToggle
      v-if="space.id === 'dxdao-eth-1'"
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
<style lang="scss">
.nav-links {
  a {
    button {
      border-radius: 0 !important;
    }
  }
  a:first-child {
    button {
      -moz-border-radius-topleft: 0.5rem !important;
      -moz-border-radius-bottomleft: 0.5rem !important;

      border-top-left-radius: 0.5rem !important;
      border-bottom-left-radius: 0.5rem !important;
    }
  }
  a:last-child {
    button {
      -moz-border-radius-topright: 0.5rem !important;
      -moz-border-radius-bottomright: 0.5rem !important;

      border-top-right-radius: 0.5rem !important;
      border-bottom-right-radius: 0.5rem !important;
    }
  }
}
</style>
