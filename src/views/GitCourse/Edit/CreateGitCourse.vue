<script setup lang="ts">
import Block from '@/components/Block.vue';
import Icon from '@/components/Icon.vue';
import LayoutSingle from '@/components/Layout/Single.vue';
import PageLoading from '@/components/PageLoading.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiInput from '@/components/Ui/Input.vue';
import UiSidebarButton from '@/components/Ui/SidebarButton.vue';
import { useEditGuideCourse } from '@/composables/course/useEditGuideCourse';
import { useClient } from '@/composables/useClient';
import { useModal } from '@/composables/useModal';
import { useWeb3 } from '@/composables/useWeb3';
import { setPageTitle } from '@/helpers/utils';
import { GuideCoursePublishStatus } from '@dodao/onboarding-schemas/models/GuideBundleModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed, inject, onMounted, PropType, ref, unref } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  spaceId: String,
  space: { type: Object as PropType<SpaceModel>, required: true },
  from: String,
  uuid: String
});

const { web3, web3Account } = useWeb3();
const { clientLoading } = useClient();
const notify = inject('notify') as any;

const route = useRoute();

const uuid = route.params.uuid;

const preview = ref(false);

const {
  guideBundleCreating,
  guideBundleLoaded,
  guideBundleRef: guideBundle,
  guideBundleErrors,
  handleSubmit,
  initialize
} = useEditGuideCourse(uuid as string, props.space, notify);
const { modalAccountOpen } = useModal();

const form = ref(guideBundle);

const isValid = computed(() => {
  return !clientLoading.value && !web3.value.authLoading;
});

function clickSubmit() {
  !web3Account.value ? (modalAccountOpen.value = true) : handleSubmit();
}

const errors = unref(guideBundleErrors);

const bundleHasErrors = computed(() => {
  return Object.values(guideBundleErrors.value).filter(v => !!v).length > 0;
});

function inputError(field: string) {
  return errors[field];
}

onMounted(async () => {
  setPageTitle('page.title.guide.create', { space: props.space?.name });
  await initialize();
});

function selectPublishStatus(status) {
  form.value.publishStatus = status;
}

const guideBundleStatuses = [
  {
    text: 'Live',
    action: GuideCoursePublishStatus.Live
  },
  {
    text: 'Draft',
    action: GuideCoursePublishStatus.Draft
  }
];
</script>

<template>
  <LayoutSingle v-bind="$attrs">
    <template #content>
      <div class="px-4 md:px-0 overflow-hidden">
        <router-link
          :to="
            guideBundle.id
              ? {
                  name: 'guideBundle',
                  params: { key: space.id, uuid: guideBundle.uuid }
                }
              : { name: 'guideBundles' }
          "
          class="text-color"
        >
          <Icon name="back" size="22" class="!align-middle" />
          {{ guideBundle.id ? guideBundle.name : 'Back to Courses' }}
        </router-link>

        <UiSidebarButton v-if="preview" @click="preview = false" class="float-right">
          <Icon name="back" size="18" />
        </UiSidebarButton>
      </div>
      <template v-if="guideBundleLoaded">
        <Block :title="$t('courses.create.basicInfo')" :class="`mt-4`">
          <div class="mb-2">
            <UiInput v-model="form.name" :error="inputError('name')" maxlength="32">
              <template v-slot:label>{{ $t(`courses.create.name`) }}*</template>
            </UiInput>

            <div class="status-wrapper pt-3">
              <UiDropdown
                top="2.5rem"
                right="2.5rem"
                class="mr-2 w-[5rem] status-drop-down"
                @select="selectPublishStatus($event)"
                :items="guideBundleStatuses"
              >
                <div class="pr-1 select-none">
                  {{ form.publishStatus === 'Live' ? 'Live' : 'Draft' }}
                </div>
              </UiDropdown>
              <div class="input-label text-color mr-2 whitespace-nowrap absolute forceFloat">Publish Status*</div>
            </div>
          </div>
        </Block>

        <div v-if="bundleHasErrors" class="!text-red flex text-center justify-center mb-2 align-baseline">
          <i class="iconfont iconwarning !text-red" data-v-abc9f7ae=""></i>
          <span class="ml-1">Fix errors to proceed</span>
        </div>

        <UiButton
          @click="clickSubmit"
          :disabled="!isValid"
          :loading="clientLoading || !guideBundleLoaded || guideBundleCreating"
          class="block w-full mt-4"
          variant="contained"
          primary
        >
          {{ $t('create.publish') }}
        </UiButton>
      </template>
      <PageLoading v-else />
    </template>
  </LayoutSingle>
</template>
<style scoped lang="scss">
.status-wrapper {
  border-bottom: 1px solid var(--border-color);
}
.forceFloat {
  transform: translatey(-44px);
  @apply text-xs;
  transition: transform 0.1s linear, font-size 0.1s linear;
}

.status-drop-down {
  color: var(--link-color);
}
</style>
