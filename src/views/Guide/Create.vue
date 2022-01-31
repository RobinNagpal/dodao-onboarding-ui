<script setup lang="ts">
import { useClient } from '@/composables/useClient';
import { useDomain } from '@/composables/useDomain';
import { useEditGuide } from '@/composables/useEditGuide';
import { useModal } from '@/composables/useModal';
import { useTerms } from '@/composables/useTerms';
import { useWeb3 } from '@/composables/useWeb3';
import { setPageTitle } from '@/helpers/utils';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed, inject, onMounted, PropType, ref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  spaceId: String,
  space: { type: Object as PropType<SpaceModel>, required: true },
  from: String,
  uuid: String
});

const { domain } = useDomain();
const { web3, web3Account } = useWeb3();
const { clientLoading } = useClient();
const notify = inject('notify') as any;

const route = useRoute();

const uuid = route.params.uuid;

const contentLimit = ref(14400);
const preview = ref(false);
console.log('uuid', uuid);
const {
  activeStepId,
  addStep,
  guideCreating,
  guideLoaded,
  guideRef: guide,
  handleSubmit,
  initialize,
  moveStepUp,
  moveStepDown,
  setActiveStep,
  updateStep
} = useEditGuide(uuid as string, props.space, notify);

const form = ref(guide);

const steps = computed(() => {
  return form.value.steps;
});

const passValidation = ref([true]);

const isValid = computed(() => {
  return (
    !clientLoading.value &&
    form.value.name &&
    form.value.content.length <= contentLimit.value &&
    passValidation.value[0] &&
    !web3.value.authLoading
  );
});

const { modalAccountOpen } = useModal();
const { modalTermsOpen, termsAccepted } = useTerms(props.spaceId);

function clickSubmit() {
  !web3Account.value
    ? (modalAccountOpen.value = true)
    : !termsAccepted.value && props.space?.terms
    ? (modalTermsOpen.value = true)
    : handleSubmit();
}

function inputError() {
  return false;
}

onMounted(async () => {
  setPageTitle('page.title.space.create', { space: props.space?.name });

  await initialize();
});
</script>

<template>
  <LayoutSingle v-bind="$attrs">
    <template #content>
      <div class="px-4 md:px-0 overflow-hidden">
        <router-link
          :to="domain ? { path: '/' } : { name: 'guides' }"
          class="text-color"
        >
          <Icon name="back" size="22" class="!align-middle" />
          {{ space.name }}
        </router-link>
        <UiSidebarButton
          v-if="!preview && guideLoaded"
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
      <template v-if="guideLoaded">
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
          :loading="clientLoading || !guideLoaded || guideCreating"
          class="block w-full"
          primary
        >
          {{ $t('create.publish') }}
        </UiButton>
      </template>
      <PageLoading v-else />
    </template>
  </LayoutSingle>
</template>
