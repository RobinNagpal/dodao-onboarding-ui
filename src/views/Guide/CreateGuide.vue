<script setup lang="ts">
import PageLoading from '@/components/PageLoading.vue';
import { emptyGuide } from '@/composables/guide/EmptyGuide';
import { useWeb3 } from '@/composables/useWeb3';
import { GuideType } from '@dodao/onboarding-schemas/models/GuideModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { onMounted, PropType } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  spaceId: String,
  space: { type: Object as PropType<SpaceModel>, required: true },
  spaceLoading: Boolean,
  from: { type: String }
});

const router = useRouter();
const route = useRoute();

const { web3 } = useWeb3();

onMounted(async () => {
  const emptyGuideModel = emptyGuide(
    web3.value.account,
    props.space,
    (route.params.guideType as string) || GuideType.Onboarding
  );
  await router.push({
    name: 'guideEdit',
    params: {
      key: props.space.id,
      uuid: emptyGuideModel.uuid,
      settingTab: 'basic',
      editGuide: JSON.stringify(emptyGuideModel)
    }
  });
});
</script>

<template>
  <div class="page-main flex mx-auto justify-between">
    <PageLoading />
  </div>
</template>
