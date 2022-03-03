<script setup lang="ts">
import { useViewGuide } from '@/composables/useViewGuide';
import { useViewGuideSubmissions } from '@/composables/useViewSubmissions';
import { setPageTitle } from '@/helpers/utils';
import GuideSubmissionsTimelineGuideSubmission from '@/components/GuideSubmissions/TimelineGuideSubmission.vue';
import NoResults from '@/components/NoResults.vue';
import LayoutSingle from '@/components/Layout/Single.vue';
import Block from '@/components/Block.vue';
import RowLoading from '@/components/RowLoading.vue';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { inject, onMounted, PropType } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  spaceId: String,
  space: { type: Object as PropType<SpaceModel>, required: true },
  spaceLoading: Boolean
});

const route = useRoute();
const notify = inject('notify') as Function;

const uuid = route.params.uuid;

const { guideRef: guide, initialize: initializeGuide } = useViewGuide(
  uuid as string,
  notify,
  props.space
);

const {
  guideSubmissionsRef,
  initialize: initializeGuideSubmissions,
  submissionsLoadedRef
} = useViewGuideSubmissions(uuid as string);

onMounted(async () => {
  await initializeGuide();
  await initializeGuideSubmissions();
  setPageTitle('page.title.dao.guide', {
    guide: guide.value?.name,
    space: props.space?.name
  });
});
</script>

<template>
  <div class="flex w-[1248px] mx-auto">
    <LayoutSingle v-bind="$attrs">
      <template #content>
        <div class="mt-6" v-if="submissionsLoadedRef">
          <NoResults :block="true" v-if="guideSubmissionsRef.length < 1" />
          <div v-else>
            <div>
              <GuideSubmissionsTimelineGuideSubmission
                v-for="(submission, i) in guideSubmissionsRef"
                :key="i"
                :submission="submission"
              />
            </div>
          </div>
          <div
            style="height: 10px; width: 10px; position: absolute"
            ref="endElement"
          />
        </div>
        <Block v-else :slim="true">
          <RowLoading class="my-2" />
        </Block>
      </template>
    </LayoutSingle>
  </div>
</template>
