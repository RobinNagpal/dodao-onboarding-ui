<script setup lang="ts">
import Block from '@/components/Block.vue';
import UiButton from '@/components/Ui/Button.vue';
import { useSpace } from '@/composables/useSpace';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { PropType } from 'vue';

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true },
  guideType: { type: String, default: 'course' }
});
const { isAdmin } = useSpace(props.space);
</script>
<template>
  <div class="mb-3 text-center">
    <Block class="pt-1" v-if="isAdmin">
      <p v-if="guideType" v-text="$t(`guides.createFirstGuide.${guideType}`)" class="mb-2" />
      <p v-else v-text="$t(`guides.createYourFirstGuide`)" class="mb-2" />
      <router-link :to="{ name: 'guideCreate', params: { key: space.id } }">
        <UiButton>
          {{ $t('guides.createGuide') }}
        </UiButton>
      </router-link>
    </Block>
    <Block class="pt-1" v-else>
      <p v-if="guideType" v-text="$t(`guides.noGuides.${guideType}`)" class="mb-2" />
      <p v-else v-text="$t(`guides.noGuidesHere`)" class="mb-2" />
    </Block>
  </div>
</template>
