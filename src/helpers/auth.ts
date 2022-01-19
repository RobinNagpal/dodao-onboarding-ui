import connectors from '@/helpers/connectors.json';
import fortmatic from '@snapshot-labs/lock/connectors/fortmatic';
import gnosis from '@snapshot-labs/lock/connectors/gnosis';
import injected from '@snapshot-labs/lock/connectors/injected';
import portis from '@snapshot-labs/lock/connectors/portis';
import torus from '@snapshot-labs/lock/connectors/torus';
import walletconnect from '@snapshot-labs/lock/connectors/walletconnect';
import walletlink from '@snapshot-labs/lock/connectors/walletlink';

const options: any = { connectors: [] };
const lockConnectors = {
  injected,
  walletconnect,
  torus,
  walletlink,
  portis,
  fortmatic,
  gnosis,
  trezor: injected
};

Object.entries(connectors).forEach((connector: any) => {
  options.connectors.push({
    key: connector[0],
    connector: lockConnectors[connector[0]],
    options: connector[1].options
  });
});

export default options;
