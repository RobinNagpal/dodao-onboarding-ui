import App from '@/App.vue';
import { apolloClient } from '@/helpers/apollo';
import '@/helpers/auth';
import options from '@/helpers/auth';
import i18n from '@/helpers/i18n';
import router from '@/router';
import '@/style.scss';
import { LockPlugin } from '@snapshot-labs/lock/plugins/vue3';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { Buffer } from 'buffer';
import { createApp, h, provide } from 'vue';
import VueTippy from 'vue-tippy';
import '../snapshot-spaces/skins';

(window as any).global = window;
(window as any).Buffer = Buffer;

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App)
})
  .use(i18n)
  .use(router)
  .use(LockPlugin, options)
  .use(VueTippy, {
    defaultProps: { delay: [400, null] },
    directive: 'tippy' // => v-tippy
  });

app.mount('#app');

export default app;
