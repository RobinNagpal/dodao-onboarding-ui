<script setup lang="ts">
import UiButton from '@/components/Ui/Button.vue';
import { EditGuideType } from '@/composables/guide/useEditGuide';
import { computed, PropType } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  guide: {
    type: Object as PropType<EditGuideType>,
    required: true
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
          name: 'guideEdit',
          params: {
            ...(route.params || {}),
            settingTab: tab,
            editGuide: JSON.stringify(guide)
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
