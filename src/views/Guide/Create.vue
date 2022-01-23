<script setup lang="ts">
import { computed, inject, onMounted, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
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
import { setPageTitle } from '@/helpers/utils';
import orderBy from 'lodash/orderBy';
import { Guide, GuideStep, QuestionType } from '@/models/Guide';

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
const notify = inject('notify') as any;

const route = useRoute();
const contentLimit = ref(14400);
const preview = ref(false);

const guideSteps: GuideStep[] = [
  {
    id: 'step1_id',
    name: 'Introduction',
    content: `
      Some basic Git commands are:
      \`\`\`
      git status
      git add
      git commit
      \`\`\`
      `,
    questions: [],
    order: 0
  },
  {
    id: 'step2_id',
    name: 'Introduction Evaluation',
    content: ``,
    questions: [
      {
        id: 'question_1',
        content: 'Dog or a Cat, Do or a Cat, Dog or a Cat',
        choices: [
          {
            key: 'dog_and_cat',
            content: 'Dog And Cat',
            order: 0
          },
          {
            key: 'dog_or_cat',
            content: 'Dog Or Cat',
            order: 1
          },
          {
            key: 'only_dog',
            content: 'Only Dog',
            order: 2
          },
          {
            key: 'only_cat',
            content: 'Only Cat',
            order: 3
          }
        ],
        answerKeys: ['dog_or_cat', 'only_dog', 'only_cat'],
        questionType: QuestionType.MultipleChoice,
        order: 0
      },
      {
        id: 'question_2',
        content: 'True or False',
        choices: [
          {
            key: 'true',
            content: 'True',
            order: 0
          },
          {
            key: 'false',
            content: 'False',
            order: 1
          }
        ],
        answerKeys: ['true'],
        questionType: QuestionType.MultipleChoice,
        order: 1
      }
    ],

    order: 1
  }
];
const guide: Guide = {
  id: 'some_id',
  name: 'Guide Name',
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
  steps: guideSteps,
  metadata: {}
} as Guide;

const form = ref(guide);

const steps = computed(() => {
  return form.value.steps;
});

const minOrder = Math.min(...steps.value.map(step => step.order));
const activeStepId = ref(steps.value.find(step => step.order === minOrder)!.id);

function setActiveStep(id) {
  activeStepId.value = id;
}

function updateStep(step) {
  form.value.steps = form.value.steps.map(s => {
    if (s.id === step.id) {
      return step;
    } else {
      return s;
    }
  });
}

function moveStepUp(stepId) {
  const stepIndex = form.value.steps.findIndex(s => s.id === stepId);
  form.value.steps[stepIndex - 1].order = stepIndex;
  form.value.steps[stepIndex].order = stepIndex - 1;

  form.value.steps = orderBy(form.value.steps, 'order');
}

function moveStepDown(stepId) {
  const stepIndex = form.value.steps.findIndex(s => s.id === stepId);
  form.value.steps[stepIndex + 1].order = stepIndex;
  form.value.steps[stepIndex].order = stepIndex + 1;

  form.value.steps = orderBy(form.value.steps, 'order');
}

function addStep() {
  form.value.steps = [
    ...form.value.steps,
    {
      id: `step ${form.value.steps.length + 1}_id`,
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
  form.value.metadata.network = props.space?.network;
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
      query: GUIDE_QUERY,
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
      <GuideStepper
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
