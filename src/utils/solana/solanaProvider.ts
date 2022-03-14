import { CustomProvider, Domain } from '@/utils/auth/customProvider';
import { useSolanaWallet } from '@/utils/solana/useSolanaWallet';
import bs58 from 'bs58';

export class SolanaProvider implements CustomProvider {
  connectorName = 'solana';

  encoder = new TextEncoder(); // always utf-8
  textDecoder = new TextDecoder('utf-8');

  async _signTypedData(
    domain: Domain,
    types: any,
    message: any
  ): Promise<string> {
    const { signMessage } = useSolanaWallet();
    // copied from https://github.com/solana-labs/wallet-adapter/blob/master/FAQ.md#how-can-i-sign-and-verify-messages
    const unit8Array = await signMessage.value?.(
      this.encoder.encode(JSON.stringify({ domain, types, message }))
    );
    return bs58.encode(unit8Array!);
  }
}
