<script setup lang="ts">
import Icon from '@/components/Icon.vue';
import UiAvatar from '@/components/Ui/Avatar.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiPopover from '@/components/Ui/Popover.vue';
import { useUsername } from '@/composables/useUsername';
import { useWeb3 } from '@/composables/useWeb3';
import { explorerUrl, getIpfsUrl, shorten } from '@/helpers/utils';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { PropType, watchEffect } from 'vue';

const props = defineProps({
  address: { type: String, required: true },
  space: Object,
  proposal: Object,
  profile: { type: Object as PropType<any> }
});

const { isEthBlockchain } = useWeb3();

const { address, profile, username } = useUsername();

if (isEthBlockchain && props.profile) {
  watchEffect(() => {
    profile.value = props.profile;
  });
}

watchEffect(() => {
  address.value = props.address;
});
</script>

<template>
  <span>
    <UiPopover :options="{ offset: [0, 12], placement: 'bottom-start' }">
      <template v-slot:item>
        <a class="flex flex-nowrap">
          <UiAvatar
            :imgsrc="getIpfsUrl(profile?.image)"
            :address="address"
            size="18"
            class="mr-2"
          />
          <span class="truncate">{{ username }}</span>
          <Badges :address="address" :members="space?.members" />
        </a>
      </template>
      <template v-slot:content>
        <div class="m-4 mb-0 text-center">
          <UiAvatar
            :imgsrc="getIpfsUrl(profile?.image)"
            :address="address"
            size="64"
            class="mb-4"
          />
          <h3 v-if="profile?.name" class="mt-3" v-text="profile.name" />
          <h3 v-else-if="profile?.ens" v-text="profile.ens" class="mt-3" />
          <h3 v-else v-text="shorten(address)" class="mt-3" />
        </div>
        <div class="m-4" v-if="isEthBlockchain">
          <a
            :href="
              explorerUrl(proposal?.network || space?.network || '1', address)
            "
            target="_blank"
            class="mb-2 block"
          >
            <UiButton class="button-outline w-full">
              {{ $t('seeInExplorer') }}
              <Icon name="external-link" class="ml-1" />
            </UiButton>
          </a>
        </div>
      </template>
    </UiPopover>
  </span>
</template>
