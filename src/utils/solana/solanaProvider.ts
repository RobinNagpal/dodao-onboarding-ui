import { CustomProvider, Domain } from '@/utils/auth/customProvider';
import { useSolanaWallet } from '@/utils/solana/useSolanaWallet';

export class SolanaProvider implements CustomProvider {
  connectorName = 'solana';

  encoder = new TextEncoder(); // always utf-8

  async _signTypedData(
    domain: Domain,
    types: any,
    message: any
  ): Promise<string> {
    const { signMessage } = useSolanaWallet();
    const unit8Array = await signMessage.value?.(
      this.encoder.encode(JSON.stringify({ domain, types, message }))
    );
    return new TextDecoder().decode(unit8Array!);
  }
}
