<script setup lang="ts">
import Block from '@/components/Block.vue';
import GuideSubmissionsTimelineGuideSubmission from '@/components/GuideSubmissions/TimelineGuideSubmission.vue';
import LayoutSingle from '@/components/Layout/Single.vue';
import NoResults from '@/components/NoResults.vue';
import RowLoading from '@/components/RowLoading.vue';
import { useViewGuide } from '@/composables/guide/useViewGuide';
import { useViewGuideSubmissions } from '@/composables/guide/useViewSubmissions';
import { setPageTitle } from '@/helpers/utils';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { inject, onMounted, PropType, ref } from 'vue';
import { useRoute } from 'vue-router';
import { AgGridVue } from '@ag-grid-community/vue3';
import { ColDef, GridApi, GridReadyEvent } from '@ag-grid-community/core';
import { formatDate } from '@/utils/date/dateFormatUtils';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import GuideSubmissionPayModal from './GuideSubmissionPayModal.vue';

const props = defineProps({
  spaceId: String,
  space: { type: Object as PropType<SpaceModel>, required: true },
  spaceLoading: Boolean
});

const route = useRoute();
const notify = inject('notify') as Function;

const uuid = route.params.uuid;

const { guideRef: guide, initialize: initializeGuide } = useViewGuide(uuid as string, notify, props.space);

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

const columnDefs: ColDef[] = [
  {
    headerName: 'Created By',
    field: 'createdBy',
    wrapText: true,
    autoHeight: true,
    checkboxSelection: true,
  },
  {
    headerName: 'Result',
    field: 'correctQuestions',
    valueGetter: params => params.data.result.correctQuestions.length + '/' + params.data.result.allQuestions.length,
    wrapText: true,
    autoHeight: true,
    flex: 2
  },
  {
    headerName: 'Created Date',
    field: 'created',
    wrapText: true,
    autoHeight: true,
    valueFormatter: params => formatDate(new Date(params.value))
  }
];

const gridApi = ref<GridApi>();

</script>

<template>
  <div class="flex w-[1248px] mx-auto">
    <LayoutSingle v-bind="$attrs">
      <template #content>
        <Block slim title="Guide Sumission">
          <div>
            <div class="mt-6" v-if="submissionsLoadedRef">
              <NoResults :block="true" v-if="guideSubmissionsRef.length === 0" />
              <div v-else>
                <ag-grid-vue
                  rowClass="custom-row"
                  style="width: 100%"
                  class="ag-theme-alpine theme-table"
                  :columnDefs="columnDefs"
                  :rowData="guideSubmissionsRef"
                  :rowHeight="80"
                  domLayout="autoHeight"
                  :defaultColDef="{
                    flex: 1,
                    cellClass: '!flex flex-col justify-center',
                    cellStyle: { lineHeight: '24px' }
                  }"
                  :gridOptions="{ suppressCellSelection: true, enableCellTextSelection: true }"
                  :modules="[ClientSideRowModelModule]"
                  rowSelection="multiple"
                >
                </ag-grid-vue>
              </div>
              <div style="height: 10px; width: 10px; position: absolute" ref="endElement" />
            </div>
            <RowLoading v-else :slim="true" class="my-2" />
          </div>
        </Block>
      </template>
    </LayoutSingle>
  </div>
  <GuideSubmissionPayModal open :space="space"></GuideSubmissionPayModal>
</template>

<style lang="scss">
.custom-row {
  padding-top: 8px;
  padding-bottom: 8px;
}

.theme-table {
  .ag-cell-focus,
  .ag-cell-no-focus {
    border: none !important;
  }

  /* This CSS is to not apply the border for the column having 'no-border' class */
  .ag-cell:focus {
    border: none !important;
    outline: none;
  }
}
</style>
