import { ExtendedSpace_space_spaceIntegrations_gnosisSafeWallets } from '@/graphql/generated/graphqlDocs';
import { FormattedGnosisWallet } from '@/types/space/formattedGnosisWallet';
import { ICellRendererParams } from '@ag-grid-community/core/dist/cjs/es5/rendering/cellRenderers/iCellRenderer';

export interface GnosisWalletParams extends ICellRendererParams {
  data: ExtendedSpace_space_spaceIntegrations_gnosisSafeWallets & FormattedGnosisWallet;
}
