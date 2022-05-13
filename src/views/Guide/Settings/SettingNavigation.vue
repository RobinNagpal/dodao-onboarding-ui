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
  paramsMap: {
    type: Object as PropType<any>,
    default: () => ({
      basic: {
        discordRoleIds: []
      },
      advanced: {
        discordRoleIds: []
      }
    })
  }
});

const route = useRoute();
const currentTab = computed(() => {
  return route.params?.settingTab || 'basic';
});

const settingTabs = ['basic', 'advanced'];
</script>
<template>
  <div class="flex topnav-domain-navigation">
    <div class="flex nav-links">
      <router-link
        v-for="tab in settingTabs"
        :key="tab"
        :to="{
          name: route.params?.uuid ? 'guideEdit' : 'guideCreate',
          params: {
            ...(route.params || {}),
            settingTab: tab,
            ...(props.paramsMap[tab] || {})
          }
        }"
      >
        <UiButton
          :variant="currentTab === tab ? 'contained' : 'outlined'"
          class="whitespace-nowrap capitalize"
          :primary="true"
        >
          {{ tab }}
        </UiButton>
      </router-link>
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
