<script setup lang="ts">
import UiButton from '@/components/Ui/Button.vue';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { PropType } from 'vue';
import { RouteParamValue } from 'vue-router';

type Param = string | RouteParamValue[];

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true },
  guideType: { type: Object as PropType<Param> },
  bundleType: { type: Object as PropType<Param> },
  categoryType: { type: String, required: true },
  orCondition: Boolean
});

const linkClass =
  props.guideType === props.categoryType ||
  props.bundleType === props.categoryType ||
  props.orCondition
    ? 'router-link-exact-active'
    : '';
</script>

<template>
  <router-link
    :to="{
      name: 'guides',
      params: { guideType: categoryType, key: space.id }
    }"
    :class="linkClass"
  >
    <UiButton class="whitespace-nowrap">
      {{ $t(`navigation.${categoryType}`) }}
    </UiButton>
  </router-link>
</template>
<style lang="scss" scoped>
.router-link-exact-active {
  button {
    color: white;
    background-color: var(--primary-color);
    border: 1px solid var(--border-color);

    &:hover {
      color: white;
      background-color: var(--primary-color);
      border: 1px solid var(--border-color);
      cursor: default;
    }
  }
}
</style>
