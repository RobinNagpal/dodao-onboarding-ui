import LockConnector from '@/utils/auth/connector';
import { CustomProvider, Domain } from '@/utils/auth/customProvider';
import useNearWallet from '@/utils/near/useNearWallet';

export class NearProvider implements CustomProvider {
  connectorName = 'near';

  async _signTypedData(
    domain: Domain,
    types: any,
    message: any
  ): Promise<string> {
    const near = useNearWallet();
    await near.nearLogin();
    const wallet = near.nearWalletConnection.value;
    const networkId = wallet!._networkId;
    const accountId = wallet!.getAccountId();
    const keyPair = await wallet?._keyStore.getKey(networkId, accountId);
    const msg = Buffer.from(JSON.stringify({ domain, types, message }));
    const signResult = keyPair?.sign(msg);
    return signResult
      ? new TextDecoder().decode(signResult.signature)
      : 'some_signature';
  }
}
export default class Connector extends LockConnector {
  near = useNearWallet();
  async connect() {
    console.log('near connect');
    await this.near.nearLogin();
    return new NearProvider();
  }

  logout() {
    if (localStorage) {
      localStorage.removeItem('near');
    }
  }
}
