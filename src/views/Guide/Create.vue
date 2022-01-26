<script setup lang="ts">
import { useApolloQuery } from '@/composables/useApolloQuery';
import { useApp } from '@/composables/useApp';
import { useClient } from '@/composables/useClient';
import { useDomain } from '@/composables/useDomain';
import { useExtendedSpaces } from '@/composables/useExtendedSpaces';
import { useModal } from '@/composables/useModal';
import { useStore } from '@/composables/useStore';
import { useTerms } from '@/composables/useTerms';
import { useWeb3 } from '@/composables/useWeb3';
import { GuideQuery } from '@/graphql/guides.graphql';
import { setPageTitle } from '@/helpers/utils';
import { GuideModel, GuideStep, QuestionType } from '@/models/GuideModel';
import { emptyGuide } from '@/views/Guide/EmptyGuide';
import { getInstance } from '@snapshot-labs/lock/plugins/vue3';
import { clone } from '@snapshot-labs/snapshot.js/src/utils';
import validations from '@snapshot-labs/snapshot.js/src/validations';
import orderBy from 'lodash/orderBy';
import { v4 as uuidv4 } from 'uuid';
import { computed, inject, onMounted, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  spaceId: String,
  space: Object,
  from: String,
  uuid: String
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
const notify = inject('notify') as any;

const route = useRoute();

const uuid = route.params.uuid;

const contentLimit = ref(14400);
const preview = ref(false);

const guide: GuideModel = emptyGuide(props.space) as GuideModel;

const form = ref(guide);

const steps = computed(() => {
  return form.value.steps;
});

const minOrder = Math.min(...steps.value.map(step => step.order));
const activeStepId = ref(
  steps.value.find(step => step.order === minOrder)?.uuid
);

function setActiveStep(uuid) {
  activeStepId.value = uuid;
}

function updateStep(step) {
  form.value.steps = form.value.steps.map(s => {
    if (s.uuid === step.uuid) {
      return step;
    } else {
      return s;
    }
  });
}

function moveStepUp(stepUuid) {
  const stepIndex = form.value.steps.findIndex(s => s.uuid === stepUuid);
  form.value.steps[stepIndex - 1].order = stepIndex;
  form.value.steps[stepIndex].order = stepIndex - 1;

  form.value.steps = orderBy(form.value.steps, 'order');
}

function moveStepDown(stepUuid) {
  const stepIndex = form.value.steps.findIndex(s => s.uuid === stepUuid);
  form.value.steps[stepIndex + 1].order = stepIndex;
  form.value.steps[stepIndex].order = stepIndex + 1;

  form.value.steps = orderBy(form.value.steps, 'order');
}

function addStep() {
  form.value.steps = [
    ...form.value.steps,
    {
      uuid: uuidv4(),
      name: `Step ${form.value.steps.length + 1}`,
      content: '',
      order: form.value.steps.length,
      questions: []
    }
  ];
}

const passValidation = ref([true]);

// Check if account passes space validation
watchEffect(async () => {
  if (web3Account.value && auth.isAuthenticated.value) {
    const validationName = props.space?.validation?.name ?? 'basic';
    const validationParams = props.space?.validation?.params ?? {};
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

const isValid = computed(() => {
  return (
    !clientLoading.value &&
    form.value.name &&
    form.value.content.length <= contentLimit.value &&
    passValidation.value[0] &&
    !web3.value.authLoading
  );
});

async function handleSubmit() {
  form.value.metadata['network'] = props.space?.network;
  const result = await send(props.space, 'guide', form.value);
  console.log(result);
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
    : !termsAccepted.value && props.space?.terms
    ? (modalTermsOpen.value = true)
    : handleSubmit();
}

const { apolloQuery, queryLoading } = useApolloQuery();

async function loadGuide() {
  const guide = await apolloQuery(
    {
      query: GuideQuery,
      variables: {
        id: props.from
      }
    },
    'guide'
  );

  const { network } = guide;
  form.value.metadata = { network };
}

function inputError(field) {
  return false;
}

onMounted(async () => {
  setPageTitle('page.title.space.create', { space: props.space?.name });

  if (props.from) await loadGuide();
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
          <TextareaAutosize
            v-model="form.content"
            :placeholder="$t(`guide.create.excerpt`)"
            class="input w-full text-left"
            style="font-size: 18px"
          />
        </UiButton>
      </div>
    </Block>
    <Block :title="$t('guide.create.stepByStep')" :slim="true">
      <GuideCreateStepper
        :activeStepId="activeStepId"
        :guide="form"
        :steps="steps"
        :setActiveStep="setActiveStep"
        :updateStep="updateStep"
        :addStep="addStep"
        :moveStepUp="moveStepUp"
        :moveStepDown="moveStepDown"
      />
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
