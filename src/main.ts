import App from '@/App.vue';
import { apolloClient } from '@/helpers/apollo';
import '@/helpers/auth';
import options from '@/helpers/auth';
import i18n from '@/helpers/i18n';
import '@/helpers/skins';
import router from '@/router';
import '@/style.scss';
import { LockPlugin } from '@/utils/auth/auth';
import { initWallet } from '@/utils/solana';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable';
import { Buffer } from 'buffer';
// You can either import the default styles or create your own.
import 'solana-wallets-vue/styles.css';
import { createApp, h, provide } from 'vue';
import VueTippy from 'vue-tippy';

const walletOptions = {
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network: WalletAdapterNetwork.Mainnet })],
  autoConnect: false
};

(window as any).global = window;
(window as any).Buffer = Buffer;

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
    provideApolloClient(apolloClient);
  },
  render: () => h(App)
})
  .use(router)
  .use(LockPlugin, options)
  .use(VueTippy, {
    defaultProps: { delay: [400, null] },
    directive: 'tippy' // => v-tippy
  });

const { t } = i18n.global;
app.config.globalProperties.$t = t;
app.config.globalProperties.$tc = t;

app.mount('#app');

initWallet(walletOptions);

export default app;
