<script setup lang="ts">
import { getCDNImageUrl } from '@dodao/onboarding-schemas/helpers/getCDNImageUrl';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed, PropType } from 'vue';
import { formatBytes32String } from '@ethersproject/strings';
import { getUrl } from '@snapshot-labs/snapshot.js/src/utils';

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true },
  size: String,
  symbolIndex: [String, Number],
  big_tile: Boolean
});

const spaceId = computed(() => props.space.id);

const url = computed(() => {
  const url: string = getUrl(props.space.avatar);
  return getCDNImageUrl(url);
});

const spaceAddress = computed(() => {
  if (spaceId.value) return formatBytes32String(spaceId.value.slice(0, 24));
  return '';
});
</script>

<template>
  <div class="align-middle leading-none">
    <UiAvatar
      :space="space"
      :imgsrc="url"
      :address="spaceAddress"
      :size="size"
      :big_tile="big_tile"
    />
  </div>
</template>
