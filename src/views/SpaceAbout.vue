<script setup lang="ts">
import Block from '@/components/Block.vue';
import BlockSpaceNew from '@/components/Block/SpaceNew.vue';
import Icon from '@/components/Icon.vue';
import UiMarkdown from '@/components/Ui/Markdown.vue';
import UiText from '@/components/Ui/Text.vue';
import User from '@/components/User.vue';
import LayoutTopAndBottom from '@/components/Layout/TopAndBottom.vue';
import { useDomain } from '@/composables/useDomain';
import { useProfiles } from '@/composables/useProfiles';
import { getNetworks } from '@/helpers/network';
import { setPageTitle } from '@/helpers/utils';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { getUrl } from '@snapshot-labs/snapshot.js/src/utils';
import { computed, onMounted, PropType, watchEffect } from 'vue';

const networks = getNetworks();

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true },
  spaceLoading: Boolean
});

const network = computed(() => networks[props.space.network]);

const { profiles, loadProfiles } = useProfiles();
const { domain } = useDomain();

watchEffect(() => {
  if (props.space.admins)
    loadProfiles(props.space.admins.concat(props.space.members));
});

onMounted(() => {
  setPageTitle('page.title.dao.about', { space: props.space.name });
});
</script>

<template>
  <LayoutTopAndBottom>
    <template #top-content v-if="!domain">
      <BlockSpaceNew :space="space" />
    </template>
    <template #content-bottom>
      <div v-if="!spaceLoading" class="card integration-main-card mt-6">
        <div v-if="space.about" class="mb-3">
          <h4 class="link-color mb-2">{{ $t('settings.about') }}</h4>
          <UiMarkdown :body="space.about" class="mb-6" />
        </div>

        <div class="mb-3">
          <h4 class="link-color mb-2">{{ $t('settings.network') }}</h4>
          <div>{{ network.name }}</div>
        </div>

        <div v-if="space.terms" class="last:mb-0 mb-3">
          <h4 class="link-color mb-2">{{ $t('settings.terms') }}</h4>
          <a :href="space.terms" target="_blank" rel="noopener noreferrer">
            <UiText :text="getUrl(space.terms)" :truncate="35" />
            <Icon name="external-link" class="ml-1" />
          </a>
        </div>
      </div>
      <Block
        :title="$t('settings.admins')"
        v-if="space.admins?.length"
        :slim="true"
        class="mb-3"
      >
        <div
          v-for="(user, i) in space.admins"
          :key="i"
          :style="i === 0 && 'border: 0 !important;'"
          class="px-4 py-3 border-t flex"
        >
          <User :address="user" :profile="profiles[user]" />
        </div>
      </Block>
      <Block
        :title="$t('settings.authors')"
        v-if="space.members?.length"
        :slim="true"
        class="mb-3"
      >
        <div
          v-for="(user, i) in space.members"
          :key="i"
          :style="i === 0 && 'border: 0 !important;'"
          class="px-4 py-3 border-t flex"
        >
          <User :address="user" :profile="profiles[user]" />
        </div>
      </Block>
    </template>
  </LayoutTopAndBottom>
</template>
