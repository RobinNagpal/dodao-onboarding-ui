<script setup lang="ts">
import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridVue } from 'ag-grid-vue3';
import LayoutSingle from '@/components/Layout/Single.vue';
import { spaceWalletQuery as SpaceWalletsResult, spaceWalletQueryVariables } from '@/graphql/generated/graphqlDocs';
import { AddSpaceWallet } from '@/graphql/spaceWallets.mutation.graphql';

import { spaceWalletQuery } from '@/graphql/spaceWallets.graphql';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { PropType, reactive, ref } from 'vue';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

import { AddSpaceWallet_payload, AddSpaceWalletVariables } from '@/graphql/generated/graphqlDocs';
import ConfirmDialog from '@/components/Modal/ConfirmDialog.vue';

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true },
  spaceId: String,
  spaceLoading: Boolean,
  discordCode: String
});

const networkArr = [
  {
    id: '1',
    name: 'Ethereum mainet'
  },
  {
    id: '2',
    name: 'Binance Smart Chain(BSC)'
  }
];
const columnDefs: ColDef[] = [
  {
    headerName: 'Name',
    field: 'name',
    wrapText: true,
    autoHeight: true
  },
  {
    headerName: 'Address',
    field: 'address',
    wrapText: true,
    autoHeight: true,
    flex: 2
  },
  { headerName: 'Chain', field: 'chain', wrapText: true, autoHeight: true }
];

const defaultColDef: ColDef = {
  flex: 1,
  cellClass: '!flex flex-col justify-center',
  cellStyle: { lineHeight: '24px' }
};

const rowData = [];

const confirmRef = ref();
const gridApi = ref<GridApi>();
const { result, loading, error, refetch, onResult, onError } = useQuery<SpaceWalletsResult, spaceWalletQueryVariables>(
  spaceWalletQuery,
  {
    spaceId: props.spaceId || ''
  }
);

const formAddWallet = reactive({
  name: '',
  address: '',
  network: networkArr[0]
});

const { mutate: addSpaceWalletMutation } = useMutation<AddSpaceWallet_payload, AddSpaceWalletVariables>(AddSpaceWallet);

function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api;
}

onResult(queryResult => {
  gridApi.value?.setRowData(queryResult.data?.spaceWallets || []);
});

onError(() => {
  gridApi.value?.setRowData([]);
});

const validateForm = () => {
  return formAddWallet.address && formAddWallet.name && formAddWallet.network;
};

const handleAddWallet = async () => {
  if (!validateForm()) {
    return;
  }
  const answer = await confirmRef.value.show({
    title: 'Confirm',
    msg: 'Are you sure you want to add this wallet?'
  });
  if (answer) {
    const payload = {
      spaceId: props.spaceId || '',
      name: formAddWallet.name,
      address: formAddWallet.address,
      chainId: formAddWallet.network.id
    };
    try {
      await addSpaceWalletMutation({
        spaceId: props.spaceId || '',
        name: formAddWallet.name,
        address: formAddWallet.address,
        chainId: formAddWallet.network.id
      });
      gridApi.value?.setRowData([...(result.value?.spaceWallets || []), payload]);
    } catch (e) {
      console.log(e);
    }
  }
};
</script>

<template>
  <LayoutSingle v-bind="$attrs">
    <template #content>
      <h1 class="flex-1 mt-3">Configure Wallet</h1>
      <div class="wrapper mt-4 py-24 flex justify-center align-center flex-col items-center">
        <ag-grid-vue
          rowClass="custom-row"
          style="width: 100%"
          class="ag-theme-alpine theme-table"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :rowHeight="80"
          domLayout="autoHeight"
          :defaultColDef="defaultColDef"
          @grid-ready="onGridReady"
          :gridOptions="{ suppressCellSelection: true, enableCellTextSelection: true }"
        >
        </ag-grid-vue>
      </div>
      <div class="flex mt-4">
        <UiInput v-model="formAddWallet.name" class="flex-1 mr-1" placeholder="My wallet">
          <template v-slot:label>Name*</template>
        </UiInput>
        <UiInput v-model="formAddWallet.address" class="flex-1 mx-1" placeholder="0x00...">
          <template v-slot:label>Address*</template>
        </UiInput>
        <UiDropdown
          top="2.5rem"
          right="1.5rem"
          class="flex-1 ml-1 cursor-pointer dropdown-input"
          @select="formAddWallet.network = $event"
          :items="networkArr"
        >
          <UiInput
            :modelValue="formAddWallet.network.name"
            class="flex-1 !cursor-pointer"
            placeholder="0x00..."
            :disabled="true"
          >
            <template v-slot:label>Network*</template>
          </UiInput>
          <template v-slot:item="{ item }">
            {{ item.name }}
          </template>
        </UiDropdown>
      </div>
      <div>
        <UiButton @click="handleAddWallet()" variant="contained" :primary="true"
          ><span class="font-bold text-xl mb-1 mr-2">&plus;</span><span>Add Wallet</span></UiButton
        >
      </div>
    </template>
  </LayoutSingle>
  <ConfirmDialog ref="confirmRef" />
</template>

<style scoped lang="scss">
.dropdown-input :deep(input) {
  cursor: pointer;
}

.wrapper {
  min-height: 100px;
}

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

<style lang="scss"></style>
