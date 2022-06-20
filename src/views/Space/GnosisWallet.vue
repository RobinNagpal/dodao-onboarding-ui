<script setup lang="ts">
import LayoutSingle from '@/components/Layout/Single.vue';
import ConfirmDialog from '@/components/Modal/ConfirmDialog.vue';
import SpaceGnosisWalletDeleteWalletCell from '@/components/Space/GnosisWallet/DeleteWalletCell.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiDropdown from '@/components/Ui/Dropdown.vue';
import UiInput from '@/components/Ui/Input.vue';
import { useExtendedSpaces } from '@/composables/useExtendedSpaces';
import { useNotifications } from '@/composables/useNotifications';
import {
  ExtendedSpace_space,
  GnosisSafeWalletInput,
  UpsertGnosisSafeWalletsVariables,
  UpsertGnosisSafeWallets_payload,
  DeleteGnosisSafeWalletVariables,
  DeleteGnosisSafeWallet_payload
} from '@/graphql/generated/graphqlDocs';
import { UpsertGnosisSafeWallets, DeleteGnosisSafeWallet } from '@/graphql/gnosisWallets.mutation.graphql';
import { ColDef, GridApi, GridReadyEvent } from '@ag-grid-community/core';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import { AgGridVue } from '@ag-grid-community/vue3';
import { onError } from '@apollo/client/link/error';
import { useMutation } from '@vue/apollo-composable';
import { v4 as uuidv4 } from 'uuid';
import { PropType, reactive, ref } from 'vue';
import i18n from '@/helpers/i18n';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import { GnosisNetWorksList } from '@/constants/gnosisWallet';

const { loadExtendedSpace } = useExtendedSpaces();
const { notify } = useNotifications();
const { t } = i18n.global;

const props = defineProps({
  space: { type: Object as PropType<ExtendedSpace_space>, required: true },
  spaceId: String,
  spaceLoading: Boolean,
  discordCode: String
});

const savingGnosisWallets = ref(false);

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
  { headerName: 'Chain', field: 'chainId', wrapText: true, autoHeight: true, cellRenderer: renderChain },
  {
    headerName: 'Actions',
    cellRenderer: SpaceGnosisWalletDeleteWalletCell,
    colId: 'params',
    autoHeight: true,
    cellRendererParams: {
      handleDeleteWallet
    }
  }
];

function renderChain(params) {
  return GnosisNetWorksList.find(chain => chain.id === params.value)?.name || '';
}

const defaultColDef: ColDef = {
  flex: 1,
  cellClass: '!flex flex-col justify-center',
  cellStyle: { lineHeight: '24px' }
};

const rowData = [];

const confirmRef = ref();
const gridApi = ref<GridApi>();

const formAddWallet = reactive({
  name: '',
  address: '',
  network: GnosisNetWorksList[0]
});

const { mutate: upsertGnosisSafeWallets } = useMutation<
  UpsertGnosisSafeWallets_payload,
  UpsertGnosisSafeWalletsVariables
>(UpsertGnosisSafeWallets);

const { mutate: deleteGnosisSafeWallet } = useMutation<DeleteGnosisSafeWallet_payload, DeleteGnosisSafeWalletVariables>(
  DeleteGnosisSafeWallet
);

async function handleDeleteWallet(rowData) {
  const answer = await confirmRef.value.show({
    title: t('confirm'),
    msg: t('setupDAO.deleteWalletConfirmMsg', { walletAddress: `${rowData.name}: ${rowData.address}` })
  });
  if (answer) {
    try {
      await deleteGnosisSafeWallet({
        spaceId: props.space.id,
        walletId: rowData.id
      });
      const spaceModel = await loadExtendedSpace(props.space.id);

      gridApi.value?.setRowData(spaceModel.spaceIntegrations?.gnosisSafeWallets || []);
    } catch {
      notify(['red', t('notify.somethingWentWrong')]);
    }
  }
}

function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api;
  console.log(props.space.spaceIntegrations?.gnosisSafeWallets);
  gridApi.value?.setRowData(props.space.spaceIntegrations?.gnosisSafeWallets || []);
}

const validateForm = () => {
  return formAddWallet.address && formAddWallet.name && formAddWallet.network;
};

const clearForm = () => {
  formAddWallet.name = '';
  formAddWallet.address = '';
  formAddWallet.network = GnosisNetWorksList[0];
};

const handleAddWallet = async () => {
  if (!validateForm()) {
    return;
  }
  const answer = await confirmRef.value.show({
    title: t('confirm'),
    msg: t('setupDAO.addWalletConfirmMsg')
  });
  if (answer) {
    savingGnosisWallets.value = true;

    const newWallet: GnosisSafeWalletInput = {
      id: uuidv4(),
      name: formAddWallet.name,
      address: formAddWallet.address,
      chainId: formAddWallet.network.id,
      order: Math.max(...(props.space.spaceIntegrations?.gnosisSafeWallets?.map(wallet => wallet.order) || [0]))
    };
    try {
      await upsertGnosisSafeWallets({
        spaceId: props.space.id,
        wallets: [...(props.space.spaceIntegrations?.gnosisSafeWallets || []), newWallet]
      });

      const spaceModel = await loadExtendedSpace(props.space.id);

      gridApi.value?.setRowData(spaceModel.spaceIntegrations?.gnosisSafeWallets || []);
      clearForm();
      savingGnosisWallets.value = false;
    } catch (e) {
      savingGnosisWallets.value = false;
      notify(['red', t('notify.somethingWentWrong')]);
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
          :modules="[ClientSideRowModelModule]"
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
          :items="GnosisNetWorksList"
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
        <UiButton :disabled="savingGnosisWallets" @click="handleAddWallet()" variant="contained" :primary="true">
          <span class="font-bold text-xl mb-1 mr-2">&plus;</span><span>Add Wallet</span>
        </UiButton>
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

:deep(.msg-delete) {
  span {
    @apply text-xs italic;
  }
}
</style>
