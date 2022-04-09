<script setup>
import { computed, watchEffect, onMounted } from 'vue';
import { useProfiles } from '@/composables/useProfiles';
import { getUrl } from '@snapshot-labs/snapshot.js/src/utils';
import { setPageTitle } from '@/helpers/utils';
import { getNetworks } from '@/helpers/network';

const networks = getNetworks();

const props = defineProps({
  space: Object,
  spaceLoading: Boolean
});

const network = computed(() => networks[props.space.network]);

const { profiles, loadProfiles } = useProfiles();

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
    <template #top-content>
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
