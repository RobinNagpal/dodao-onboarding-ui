<script setup>
import { computed, inject, onMounted, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import getProvider from '@snapshot-labs/snapshot.js/src/utils/provider';
import { getBlockNumber } from '@snapshot-labs/snapshot.js/src/utils/web3';
import { clone } from '@snapshot-labs/snapshot.js/src/utils';
import { getInstance } from '@snapshot-labs/lock/plugins/vue3';
import { useModal } from '@/composables/useModal';
import { useTerms } from '@/composables/useTerms';
import { GUIDE_QUERY } from '@/helpers/queries';
import validations from '@snapshot-labs/snapshot.js/src/validations';
import { useDomain } from '@/composables/useDomain';
import { useApolloQuery } from '@/composables/useApolloQuery';
import { useWeb3 } from '@/composables/useWeb3';
import { useClient } from '@/composables/useClient';
import { useApp } from '@/composables/useApp';
import { useExtendedSpaces } from '@/composables/useExtendedSpaces';
import { useStore } from '@/composables/useStore';
import { n, setPageTitle } from '@/helpers/utils';

const props = defineProps({
  spaceId: String,
  space: Object,
  from: String
});

const router = useRouter();
const { t } = useI18n();
const auth = getInstance();
const { domain } = useDomain();
const { web3, web3Account } = useWeb3();
const { getExplore } = useApp();
const { spaceLoading } = useExtendedSpaces();
const { send, clientLoading } = useClient();
const { store } = useStore();
const notify = inject('notify');

const route = useRoute();
const blockNumber = ref(-1);
const bodyLimit = ref(14400);
const preview = ref(false);
const showErrors = ref(false);
const form = ref({
  name: '',
  body: '',
  start: 0,
  end: 0,
  snapshot: '',
  metadata: {}
});

const modalOpen = ref(false);
const selectedDate = ref('');
const nameForm = ref(null);
const passValidation = ref([true]);
const loadingSnapshot = ref(true);

// Check if account passes space validation
watchEffect(async () => {
  if (web3Account.value && auth.isAuthenticated.value) {
    const validationName = props.space.validation?.name ?? 'basic';
    const validationParams = props.space.validation?.params ?? {};
    const isValid = await validations[validationName](
      web3Account.value,
      clone(props.space),
      '',
      clone(validationParams)
    );

    passValidation.value = [isValid, validationName];
    console.log('Pass validation?', isValid, validationName);
  }
});

const dateStart = computed(() => {
  return form.value.start;
});

const dateEnd = computed(() => {
  return form.value.end;
});

const isValid = computed(() => {
  // const ts = (Date.now() / 1e3).toFixed();
  const endDateValid = dateEnd.value ? dateEnd.value > dateStart.value : true;
  return (
    !clientLoading.value &&
    form.value.name &&
    form.value.body.length <= bodyLimit.value &&
    dateStart.value &&
    // form.value.start >= ts &&
    endDateValid &&
    passValidation.value[0] &&
    !web3.value.authLoading
  );
});

function setDate(ts) {
  if (selectedDate.value) {
    form.value[selectedDate.value] = ts;
  }
}

async function handleSubmit() {
  form.value.metadata.network = props.space.network;
  form.value.start = dateStart.value;
  form.value.end = dateEnd.value;
  console.log('Send', form.value);
  const result = await send(props.space, 'guide', form.value);
  console.log('Result', result);
  if (result.id) {
    getExplore();
    store.space.guides = [];
    notify(['green', t('notify.guideCreated')]);
    router.push({
      name: 'guide',
      params: {
        key: props.spaceId,
        id: result.id
      }
    });
  }
}

const { modalAccountOpen } = useModal();
const { modalTermsOpen, termsAccepted, acceptTerms } = useTerms(props.spaceId);

function clickSubmit() {
  !web3Account.value
    ? (modalAccountOpen.value = true)
    : !termsAccepted.value && props.space.terms
    ? (modalTermsOpen.value = true)
    : handleSubmit();
}

const { apolloQuery, queryLoading } = useApolloQuery();

async function loadGuide() {
  const guide = await apolloQuery(
    {
      query: GUIDE_QUERY,
      variables: {
        id: props.from
      }
    },
    'guide'
  );

  form.value = {
    name: guide.title,
    body: guide.body,
    start: guide.start,
    end: guide.end,
    snapshot: guide.snapshot,
    type: guide.type
  };

  const { network } = guide;
  form.value.metadata = { network };
}

function inputError(field) {
  return false;
}

onMounted(async () => {
  setPageTitle('page.title.space.create', { space: props.space.name });
  nameForm.value.focus();

  if (props.from) await loadGuide();
});

watchEffect(async () => {
  loadingSnapshot.value = true;
  if (props.space.network) {
    blockNumber.value = await getBlockNumber(getProvider(props.space.network));
    form.value.snapshot = blockNumber.value;
    loadingSnapshot.value = false;
  }
});
</script>

<template>
  <Layout v-bind="$attrs">
    <div class="px-4 md:px-0 overflow-hidden">
      <router-link
        :to="domain ? { path: '/' } : { name: 'guides' }"
        class="text-color"
      >
        <Icon name="back" size="22" class="!align-middle" />
        {{ space.name }}
      </router-link>
      <UiSidebarButton
        v-if="!preview"
        @click="preview = true"
        class="float-right"
      >
        <Icon name="preview" size="18" />
      </UiSidebarButton>
      <UiSidebarButton
        v-if="preview"
        @click="preview = false"
        class="float-right"
      >
        <Icon name="back" size="18" />
      </UiSidebarButton>
    </div>
    <Block :title="$t('guide.create.basicInfo')" :class="`mt-4`">
      <div class="mb-2">
        <UiInput v-model="form.name" :error="inputError('name')">
          <template v-slot:label>{{ $t(`guide.create.name`) }}*</template>
        </UiInput>
        <UiButton class="block w-full px-3" style="height: auto">
          <TextareaArray
            v-model="form.body"
            :placeholder="$t(`guide.create.excerpt`)"
            class="input w-full text-left"
            style="font-size: 18px"
          />
        </UiButton>
      </div>
    </Block>
    <Block :title="$t('guide.create.stepByStep')" :slim="true">
      <GuideStepper />
    </Block>

    <UiButton
      @click="clickSubmit"
      :disabled="!isValid"
      :loading="clientLoading || queryLoading"
      class="block w-full"
      primary
    >
      {{ $t('create.publish') }}
    </UiButton>
  </Layout>
</template>
