<script setup lang="ts">
import UiButton from '@/components/Ui/Button.vue';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed, PropType } from 'vue';

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true },
  guideType: { type: String },
  categoryType: { type: String, required: true }
});

const computedVariant = computed(() => (props.guideType === props.categoryType ? 'contained' : 'outlined'));
</script>

<template>
  <router-link
    :to="{
      name: 'guides',
      params: { guideType: categoryType, key: space.id }
    }"
  >
    <UiButton :variant="computedVariant" class="whitespace-nowrap" :primary="true">
      {{ $t(`navigation.${categoryType}`) }}
    </UiButton>
  </router-link>
</template>
