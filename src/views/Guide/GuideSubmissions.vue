<script setup lang="ts">
import Block from '@/components/Block.vue';
import Checkbox from '@/components/Checkbox.vue';
import LayoutSingle from '@/components/Layout/Single.vue';
import NoResults from '@/components/NoResults.vue';
import RowLoading from '@/components/RowLoading.vue';
import { useViewGuide } from '@/composables/guide/useViewGuide';
import { useViewGuideSubmissions } from '@/composables/guide/useViewSubmissions';
import { GuideSubmissionsQuery_guideSubmissions } from '@/graphql/generated/graphqlDocs';
import i18n from '@/helpers/i18n';
import { setPageTitle } from '@/helpers/utils';
import { formatDate } from '@/utils/date/dateFormatUtils';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColDef, GridApi, GridReadyEvent } from '@ag-grid-community/core';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import { AgGridVue } from '@ag-grid-community/vue3';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { inject, onMounted, PropType, ref } from 'vue';
import { useRoute } from 'vue-router';
import GuideSubmissionPayModal from './GuideSubmissionPayModal.vue';

const props = defineProps({
  spaceId: String,
  space: { type: Object as PropType<SpaceModel>, required: true },
  spaceLoading: Boolean
});

const route = useRoute();
const notify = inject('notify') as Function;

const uuid = route.params.uuid;

const { guideRef: guide, initialize: initializeGuide } = useViewGuide(uuid as string, 0, notify, props.space);

const {
  onResult,
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

const { t } = i18n.global;

const columnDefs: ColDef[] = [
  {
    headerName: t('guide.submissionTable.createdBy'),
    field: 'createdBy',
    wrapText: true,
    autoHeight: true,
    checkboxSelection: true
  },
  {
    headerName: t('guide.submissionTable.result'),
    field: 'correctQuestions',
    valueGetter: params =>
      params?.data?.result
        ? params.data.result.correctQuestions.length + '/' + params.data.result.allQuestions.length
        : '-',
    wrapText: true,
    autoHeight: true,
    flex: 2
  },
  {
    headerName: t('guide.submissionTable.createdDate'),
    field: 'created',
    wrapText: true,
    autoHeight: true,
    valueFormatter: params => (params.value ? formatDate(new Date(params.value * 1000)) : '-')
  }
];

const gridApi = ref<GridApi>();
const filteredSubmission = ref<GuideSubmissionsQuery_guideSubmissions[]>([]);

const selectedRows = ref<GuideSubmissionsQuery_guideSubmissions[]>([]);
const filterScore = ref(null);
const filterUnique = ref(true);

const openModal = ref(false);

onResult(result => {
  filteredSubmission.value = result;
  filterSubmission();
});

async function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api;
}

function onSelectionChanged() {
  selectedRows.value = (gridApi.value?.getSelectedRows() as GuideSubmissionsQuery_guideSubmissions[]) || [];
}

function handlePay() {
  openModal.value = true;
}

function handleFilterChange(value) {
  filterScore.value = value;
  filterSubmission();
}

function onlyUnique(value, index, self) {
  return self.findIndex(item => item.createdBy === value.createdBy) === index;
}

function handleFilterUniqueChange(value) {
  filterUnique.value = value;
  filterSubmission();
}

function filterSubmission() {
  if (filterScore.value && parseInt(filterScore.value)) {
    const desiredScore = parseInt(filterScore.value);
    filteredSubmission.value = guideSubmissionsRef.value.filter(
      item => item.result.correctQuestions.length >= desiredScore
    );
  } else {
    filteredSubmission.value = guideSubmissionsRef.value;
  }

  if (filterUnique.value) {
    filteredSubmission.value = filteredSubmission.value.filter(onlyUnique);
  }
  gridApi?.value?.setRowData(filteredSubmission.value);
}

const defaultColumnDef = {
  flex: 1,
  cellClass: '!flex flex-col justify-center',
  cellStyle: { lineHeight: '24px' }
};

const gridOptions = { suppressCellSelection: true, enableCellTextSelection: true };

const gridModules = [ClientSideRowModelModule];
</script>

<template>
  <div class="flex w-[1248px] mx-auto">
    <LayoutSingle v-bind="$attrs">
      <template #content>
        <Block slim :title="t('guide.submissionScreen.title')">
          <div>
            <div class="mt-6" v-if="submissionsLoadedRef">
              <NoResults :block="true" v-if="!guideSubmissionsRef || guideSubmissionsRef.length === 0" />
              <div v-else>
                <div class="flex justify-between">
                  <UiButton :disabled="selectedRows.length === 0" @click="handlePay()">{{
                    t('guide.submissionScreen.payBtn')
                  }}</UiButton>
                  <div class="flex items-center">
                    <div class="flex mr-4">
                      <Checkbox @update:modelValue="handleFilterUniqueChange" :modelValue="filterUnique" />
                      <span>{{ t('guide.submissionScreen.uniqueFilter') }}</span>
                    </div>
                    <div class="w-[150px]">
                      <UiInput
                        type="number"
                        :modelValue="filterScore"
                        @update:modelValue="handleFilterChange"
                        class="flex-1"
                        placeholder="Score"
                      >
                        <template v-slot:label>{{ t('guide.submissionScreen.score') }}</template>
                      </UiInput>
                    </div>
                  </div>
                </div>
                <ag-grid-vue
                  style="width: 100%"
                  class="ag-theme-alpine theme-table"
                  :columnDefs="columnDefs"
                  :rowData="filteredSubmission"
                  :rowHeight="80"
                  domLayout="autoHeight"
                  :defaultColDef="defaultColumnDef"
                  :gridOptions="gridOptions"
                  :modules="gridModules"
                  rowSelection="multiple"
                  @selection-changed="onSelectionChanged"
                  @model-updated="onSelectionChanged"
                  @grid-ready="onGridReady"
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
  <GuideSubmissionPayModal
    @close="openModal = false"
    :selectedSubmissions="selectedRows"
    :open="openModal"
    :space="space"
  ></GuideSubmissionPayModal>
</template>

<style lang="scss">
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
