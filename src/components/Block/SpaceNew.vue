<script setup>
import { computed, ref, watchEffect } from 'vue';
import { getInstance } from '@snapshot-labs/lock/plugins/vue3';
import { n } from '@/helpers/utils';
import { useWeb3 } from '@/composables/useWeb3';
import { useApp } from '@/composables/useApp';
import { useSpaceSubscription } from '@/composables/useSpaceSubscription';
import { useFollowSpace } from '@/composables/useFollowSpace';
import verified from '@/../snapshot-spaces/spaces/verified.json';

const props = defineProps({
  space: Object
});

const auth = getInstance();
const { web3Account } = useWeb3();

const { explore } = useApp();

const nbrMembers = explore.value.spaces[props.space.id].followers;
const isVerified = verified[props.space.id] || 0;

const isAdmin = computed(() => {
  const admins = props.space?.admins?.map(address => address.toLowerCase());

  return (
    auth.isAuthenticated.value &&
    web3Account.value &&
    admins?.includes(web3Account.value.toLowerCase())
  );
});

const {
  loading,
  toggleSubscription,
  isSubscribed,
  loadSubscriptions,
  subscriptions
} = useSpaceSubscription(props.space.id);

const { isFollowing } = useFollowSpace(props.space);

const notificationIcon = ref('notifications-off');

watchEffect(() => {
  if (subscriptions.value === undefined) {
    loadSubscriptions();
  }
  if (isSubscribed.value) {
    notificationIcon.value = 'notifications-on';
  } else notificationIcon.value = 'notifications-off';
});
</script>

<template>
  <div
    class="image-wrapper integration-icon-wrapper flex flex-col items-center px-8"
  >
    <Token :space="space" symbolIndex="space" size="80" class="mt-3 mb-2" />
    <div class="mt-2 text-color">
      {{ $tc('members', nbrMembers, { count: n(nbrMembers) }) }}
    </div>
    <div class="flex mt-2">
      <FollowButton :space="space" class="px-2" />
      <UiSidebarButton
        class="inline px-2"
        v-if="isFollowing"
        @click="toggleSubscription()"
      >
        <UiLoading v-if="loading" />
        <Icon v-else size="20" class="link-color" :name="notificationIcon" />
      </UiSidebarButton>
    </div>
  </div>
  <div class="split-content integration-details">
    <div class="integration-title-wrapper">
      <h1>
        {{ space.name }}
        <Icon
          v-if="isVerified === 1"
          v-tippy="{
            content: $t('verifiedSpace'),
            placement: 'right'
          }"
          name="check"
          size="20"
        />
        <Icon v-if="isVerified === -1" name="warning" size="20" />
      </h1>
      <p class="paragraph integration-about-excerpt">
        Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do eiusmod
        dolore temporit incididunt ut labore.
      </p>
    </div>

    <div class="px-3 flex">
      <router-link
        :to="{ name: 'guides', params: { key: space.id } }"
        v-text="$t('guides.header')"
        :class="$route.name === 'guides' && 'router-link-exact-active'"
        class="block px-4 py-2 integration-tab-link"
      />
      <router-link
        :to="{ name: 'spaceCreate', params: { key: space.id } }"
        v-text="$t('proposals.new')"
        class="block px-4 py-2 integration-tab-link"
      />
      <router-link
        :to="{ name: 'guideCreate', params: { key: space.id } }"
        v-text="$t('guides.new')"
        class="block px-4 py-2 integration-tab-link"
      />
      <router-link
        v-if="
          space.strategies?.find(strategy => strategy.name === 'delegation')
        "
        :to="{ name: 'delegate', params: { key: space.id } }"
        v-text="$t('delegate.header')"
        class="block px-4 py-2 integration-tab-link"
      />
      <router-link
        :to="{ name: 'spaceAbout', params: { key: space.id } }"
        v-text="$t('about')"
        :class="$route.name === 'spaceAbout' && 'router-link-exact-active'"
        class="block px-4 py-2 integration-tab-link"
      />
      <router-link
        v-if="isAdmin"
        :to="{ name: 'spaceSettings' }"
        v-text="$t('settings.header')"
        class="block px-4 py-2 integration-tab-link"
      />
    </div>
  </div>
</template>
