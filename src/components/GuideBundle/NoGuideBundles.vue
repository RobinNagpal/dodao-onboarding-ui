<script setup lang="ts">
import Block from '@/components/Block.vue';
import UiButton from '@/components/Ui/Button.vue';
import { useSpace } from '@/composables/useSpace';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { PropType } from 'vue';

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true }
});
const { isAdmin } = useSpace(props.space);
</script>
<template>
  <div class="mb-3 text-center">
    <Block class="pt-1" v-if="isAdmin">
      <p v-text="$t('courses.createFirstCourse')" class="mb-2" />
      <router-link :to="{ name: 'guideBundleCreate', params: { key: space.id } }">
        <UiButton>
          {{ $t('courses.createCourse') }}
        </UiButton>
      </router-link>
    </Block>
    <Block class="pt-1" v-else>
      <p v-text="$t(`courses.noCoursesYet`)" class="mb-2" />
    </Block>
  </div>
</template>
