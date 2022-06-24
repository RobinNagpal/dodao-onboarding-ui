<script setup lang="ts">
import Block from '@/components/Block.vue';
import LayoutSingle from '@/components/Layout/Single.vue';
import ConfirmDialog from '@/components/Modal/ConfirmDialog.vue';
import SpaceGnosisWalletDeleteWalletCell from '@/components/Space/GnosisWallet/DeleteWalletCell.vue';
import SpaceGnosisWalletGnosisWallet from '@/components/Space/GnosisWallet/GnosisWallet.vue';
import SpaceGnosisWalletGnosisWalletInfo from '@/components/Space/GnosisWallet/GnosisWalletInfo.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiDropdown from '@/components/Ui/Dropdown.vue';
import UiInput from '@/components/Ui/Input.vue';
import { useExtendedSpaces } from '@/composables/useExtendedSpaces';
import { useNotifications } from '@/composables/useNotifications';
import { GnosisNetWorkList } from '@/constants/gnosisNetworkList';
import {
  ExtendedSpace_space,
  ExtendedSpace_space_spaceIntegrations_gnosisSafeWallets,
  GnosisSafeWalletInput,
  UpsertGnosisSafeWallets_payload,
  UpsertGnosisSafeWalletsVariables
} from '@/graphql/generated/graphqlDocs';
import { UpsertGnosisSafeWallets } from '@/graphql/gnosisWallets.mutation.graphql';
import { formatWallet } from '@/helpers/gnosisWallet';
import i18n from '@/helpers/i18n';
import { FormattedGnosisWallet } from '@/types/space/formattedGnosisWallet';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColDef, GridApi, GridReadyEvent } from '@ag-grid-community/core';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import { AgGridVue } from '@ag-grid-community/vue3';
import { useMutation } from '@vue/apollo-composable';
import { v4 as uuidv4 } from 'uuid';
import { computed, PropType, reactive, ref } from 'vue';

const { loadExtendedSpace } = useExtendedSpaces();
const { notify } = useNotifications();
const { t } = i18n.global;

const savingGnosisWallets = ref(false);
const props = defineProps({
  space: { type: Object as PropType<ExtendedSpace_space>, required: true },
  spaceId: String,
  spaceLoading: Boolean,
  discordCode: String
});

const gnosisWallets = computed(() => props.space.spaceIntegrations?.gnosisSafeWallets);
const columnDefs: ColDef[] = [
  {
    headerName: 'Wallet',
    colId: 'wallet',
    cellRenderer: SpaceGnosisWalletGnosisWallet,
    autoHeight: true,
    flex: 5,
    width: 540
  },
  {
    headerName: 'Info',
    colId: 'walletInfo',
    cellRenderer: SpaceGnosisWalletGnosisWalletInfo,
    autoHeight: true,
    flex: 3,
    width: 240
  },
  {
    headerName: 'Actions',
    cellRenderer: SpaceGnosisWalletDeleteWalletCell,
    colId: 'actions',
    autoHeight: true,
    flex: 1,
    width: 50,
    cellRendererParams: {
      handleDeleteWallet
    }
  }
];

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
  network: GnosisNetWorkList[0],
  tokenContractAddress: ''
});

const { mutate: upsertGnosisSafeWallets } = useMutation<
  UpsertGnosisSafeWallets_payload,
  UpsertGnosisSafeWalletsVariables
>(UpsertGnosisSafeWallets);

async function handleDeleteWallet(rowData: ExtendedSpace_space_spaceIntegrations_gnosisSafeWallets) {
  const answer = await confirmRef.value.show({
    title: t('confirm'),
    msg: t('setupDAO.deleteWalletConfirmMsg', { walletAddress: `${rowData.walletName}: ${rowData.walletAddress}` })
  });
  if (answer) {
    savingGnosisWallets.value = true;
    gridApi.value?.showLoadingOverlay();
    const wallets = (gnosisWallets.value || []).filter(wallet => wallet.id !== rowData.id);
    try {
      await upsertGnosisSafeWallets({
        spaceId: props.space.id,
        wallets
      });
      const spaceModel = await loadExtendedSpace(props.space.id);

      await setRowData(spaceModel);
    } catch {
      notify(['red', t('notify.somethingWentWrong')]);
    }
    gridApi.value?.hideOverlay();
    savingGnosisWallets.value = false;
  }
}

async function setRowData(spaceModel: ExtendedSpace_space) {
  const gnosisSafeWallets = spaceModel.spaceIntegrations?.gnosisSafeWallets || [];
  const wallets =
    gnosisSafeWallets.map<Promise<ExtendedSpace_space_spaceIntegrations_gnosisSafeWallets & FormattedGnosisWallet>>(
      formatWallet
    );
  const formattedWallets = await Promise.all(wallets);
  gridApi.value?.setRowData(formattedWallets);
  gridApi.value?.refreshCells();
}

async function onGridReady(params: GridReadyEvent) {
  gridApi.value = params.api;
  gridApi.value?.showLoadingOverlay();
  await setRowData(props.space);
  gridApi.value?.hideOverlay();

  if (!gnosisWallets.value?.length) {
    gridApi.value?.showNoRowsOverlay();
  }
}

const validateForm = () => {
  return formAddWallet.address && formAddWallet.name && formAddWallet.network;
};

const clearForm = () => {
  formAddWallet.name = '';
  formAddWallet.address = '';
  formAddWallet.network = GnosisNetWorkList[0];
  formAddWallet.tokenContractAddress = '';
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
    gridApi.value?.showLoadingOverlay();

    const newWallet: GnosisSafeWalletInput = {
      id: uuidv4(),
      walletName: formAddWallet.name,
      walletAddress: formAddWallet.address,
      chainId: formAddWallet.network.chainId,
      order: Math.max(
        ...(gnosisWallets.value && gnosisWallets.value.length > 0
          ? gnosisWallets.value.map(wallet => wallet.order)
          : [0])
      ),
      tokenContractAddress: formAddWallet.tokenContractAddress
    };
    try {
      await upsertGnosisSafeWallets({
        spaceId: props.space.id,
        wallets: [...(gnosisWallets.value || []), newWallet]
      });

      const spaceModel = await loadExtendedSpace(props.space.id);

      await setRowData(spaceModel);
      clearForm();
    } catch (e) {
      notify(['red', t('notify.somethingWentWrong')]);
    }
    gridApi.value?.hideOverlay();
    savingGnosisWallets.value = false;
  }
};
</script>

<template>
  <LayoutSingle v-bind="$attrs">
    <template #content>
      <Block :title="$t('settings.gnosisWallets')" :class="`mt-4 wrapper`">
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
            :gridOptions="{ suppressCellFocus: true, enableCellTextSelection: true }"
            :modules="[ClientSideRowModelModule]"
          >
          </ag-grid-vue>
        </div>
      </Block>
      <Block :title="$t('settings.addGnosisWallet')" :class="`mt-4 wrapper`">
        <div class="flex mt-4">
          <UiInput v-model="formAddWallet.name" class="flex-1 mr-1" placeholder="My wallet">
            <template v-slot:label>Name*</template>
          </UiInput>
          <UiInput v-model="formAddWallet.address" class="flex-1 mx-1" placeholder="0x00...">
            <template v-slot:label>Address*</template>
          </UiInput>
        </div>
        <div class="flex mt-4">
          <UiDropdown
            top="2.5rem"
            right="1.5rem"
            class="flex-1 ml-1 cursor-pointer dropdown-input"
            @select="formAddWallet.network = $event"
            :items="GnosisNetWorkList"
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
          <UiInput v-model="formAddWallet.tokenContractAddress" class="flex-1 mx-1" placeholder="0x00...">
            <template v-slot:label>Token Contract Address*</template>
          </UiInput>
        </div>
        <div>
          <UiButton :disabled="savingGnosisWallets" @click="handleAddWallet()" variant="contained" :primary="true">
            <span class="font-bold text-xl mb-1 mr-2">&plus;</span><span>Add Wallet</span>
          </UiButton>
        </div>
      </Block>
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
