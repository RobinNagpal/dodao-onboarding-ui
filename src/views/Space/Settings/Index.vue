<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDomain } from '@/composables/useDomain';
import { formatSpace } from '@/helpers/utils';
import { useExtendedSpaces } from '@/composables/useExtendedSpaces';
import SpaceSettingNavigation from './Navigations.vue';
import { GuideType } from '@dodao/onboarding-schemas/models/GuideModel';

const route = useRoute();
const { domain } = useDomain();
const { loadExtendedSpace, loadExtentedSpaces, extentedSpaces, spaceLoading } = useExtendedSpaces();
const spaceId = computed(() => domain || route.params.key);
const space = computed(() => formatSpace(extentedSpaces.value?.find(s => s.id === spaceId.value)));
onMounted(() => loadExtendedSpace(spaceId.value));
</script>

<template>
  <div class="mt-4 container-default">
    <router-link
      :to="{
        name: 'guides',
        params: { guideType: GuideType.Onboarding }
      }"
      class="text-color"
    >
      <div class="mb-4"><Icon name="back" size="22" class="!align-middle" /> {{ extentedSpaces?.[0]?.name }}</div>
    </router-link>
    <Block slim :title="`${extentedSpaces[0].name}'s Settings`">
      <div class="flex flex-col md:flex-row">
        <div class="nav-wrapper mt-16">
          <SpaceSettingNavigation></SpaceSettingNavigation>
        </div>
        <div class="flex-1 ml-4">
          <router-view
            v-if="space"
            :spaceId="spaceId"
            :space="space"
            :spaceLoading="spaceLoading || spaceId !== space.id || !space?.extendedSpace"
            :loadExtentedSpaces="loadExtentedSpaces"
          />
        </div>
      </div>
    </Block>
  </div>
</template>
<style scoped lang="scss">
.nav-wrapper {
  padding-top: 24px;
  min-width: 300px;
}
</style>
