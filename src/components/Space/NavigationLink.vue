<script setup lang="ts">
import UiButton from '@/components/Ui/Button.vue';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed, PropType } from 'vue';

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true },
  guideOrBundleType: { type: String },
  categoryType: { type: String, required: true }
});

const computedVariant = computed(() =>
  props.guideOrBundleType === props.categoryType
    ? 'contained'
    : 'outlined'
);

</script>

<template>
  <router-link
    :to="{
      name: 'guides',
      params: { guideType: categoryType, key: space.id }
    }"
  >
    <UiButton :variant="computedVariant"  class="whitespace-nowrap">
      {{ $t(`navigation.${categoryType}`) }}
    </UiButton>
  </router-link>
</template>