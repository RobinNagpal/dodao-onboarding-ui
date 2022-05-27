<script setup lang="ts">
import UiDropdown from '@/components/Ui/Dropdown.vue';
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

const routeName = computed(() => {
  const routeName = route.name;
  console.log('routeName', routeName);
  return routeName;
});

function createNewBundle() {
  router.push({
    name: 'guideBundleCreate',
    params: {
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

function createNewGuide() {
  router.push({
    name: 'guideCreate',
    params: { guideType: GuideType.Course, key: props.space.id }
  });
}

function selectFromThreedotDropdown(e) {
  if (e === 'createNewGuide') createNewGuide();
  if (e === 'createNewBundle') createNewBundle();
  if (e === 'spaceSettings') editSpaceSettings();
}

const { t } = useI18n();

const threeDotItems = computed(() => {
  const items: Array<{ text: string; action: string }> = [];

  items.push({
    text: t('courses.new'),
    action: 'createNewBundle'
  });
  items.push({ text: t('guides.new'), action: 'createNewGuide' });

  return items;
});
</script>
<template>
  <div class="flex topnav-domain-navigation">
    <div v-if="isAdmin" class="pl-3 flex nav-links">
      <router-link
        :to="{
          name: 'spaceHome',
          params: { key: space.id }
        }"
      >
        <UiButton
          :variant="routeName === 'spaceHome' ? 'contained' : 'outlined'"
          class="whitespace-nowrap"
          :primary="true"
        >
          Courses
        </UiButton>
      </router-link>
      <router-link
        :to="{
          name: 'allGuides',
          params: { key: space.id }
        }"
      >
        <UiButton
          :variant="routeName === 'allGuides' ? 'contained' : 'outlined'"
          class="whitespace-nowrap"
          :primary="true"
        >
          Guides
        </UiButton>
      </router-link>
    </div>
    <div v-else>
      <h3>{{ $t('page.title.dao.bundle', { dao: props.space.name }) }}</h3>
    </div>

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
