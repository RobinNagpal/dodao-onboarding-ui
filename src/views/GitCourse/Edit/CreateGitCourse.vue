<script setup lang="ts">
import Block from '@/components/Block.vue';
import Icon from '@/components/Icon.vue';
import LayoutSingle from '@/components/Layout/Single.vue';
import PageLoading from '@/components/PageLoading.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiInput from '@/components/Ui/Input.vue';
import UiSidebarButton from '@/components/Ui/SidebarButton.vue';
import { useClient } from '@/composables/useClient';
import { useModal } from '@/composables/useModal';
import { useNotifications } from '@/composables/useNotifications';
import { useWeb3 } from '@/composables/useWeb3';
import {
  GitCourseInput,
  GitCourseSummarized,
  GitCourseSummarized_payload,
  GitCourseSummarizedVariables,
  RawGitCourse,
  RawGitCourseVariables,
  UpsertGitCourse_payload,
  UpsertGitCourseVariables
} from '@/graphql/generated/graphqlDocs';
import {
  UpsertGitCourse,
  RawGitCourse as rawGitCourse,
  GitCourseSummarized as gitCourseSummarized
} from '@/graphql/course/gitCourses.graphql';
import { apolloClient } from '@/helpers/apollo';
import i18n from '@/helpers/i18n';
import { setPageTitle } from '@/helpers/utils';
import { GuideCoursePublishStatus } from '@dodao/onboarding-schemas/models/GuideBundleModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { useMutation } from '@vue/apollo-composable';
import { computed, inject, onMounted, PropType, ref, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  spaceId: String,
  space: { type: Object as PropType<SpaceModel>, required: true },
  from: String,
  uuid: String
});

const { web3, web3Account } = useWeb3();
const { clientLoading } = useClient();
const { notify } = useNotifications();
const { t } = i18n.global;

const route = useRoute();
const router = useRouter();

const uuid = route.params.uuid;

const preview = ref(false);

const { modalAccountOpen } = useModal();

const gitCourse = ref<GitCourseSummarized_payload | undefined | null>();

const gitCourseLoaded = ref<boolean>(false);
const gitCourseUpserting = ref<boolean>(false);

const form = ref<any>({
  uuid,
  publishStatus: GuideCoursePublishStatus.Live,
  weight: 20
});

const isValid = computed(() => {
  return !clientLoading.value && !web3.value.authLoading;
});

const { mutate: upsertGitCourse } = useMutation<UpsertGitCourse_payload, UpsertGitCourseVariables>(UpsertGitCourse);

async function publishCourse() {
  gitCourseUpserting.value = true;
  try {
    await upsertGitCourse({
      spaceId: props.space.id,
      gitCourseInput: form.value as GitCourseInput
    });
  } catch {
    notify(['red', t('notify.somethingWentWrong')]);
  }

  gitCourseUpserting.value = false;
}

function clickSubmit() {
  !web3Account.value ? (modalAccountOpen.value = true) : publishCourse();
}

function showErrorNotificationAndGoToCourses() {
  notify(['red', t('notify.somethingWentWrong')]);
  router.push({
    name: 'guideBundles'
  });
}

onMounted(async () => {
  gitCourseLoaded.value = false;
  setPageTitle('page.title.guide.create', { space: props.space?.name });
  if (uuid) {
    try {
      const rawGitCourseResponse = await apolloClient.query<RawGitCourse, RawGitCourseVariables>({
        query: rawGitCourse,
        variables: {
          key: uuid as string,
          spaceId: props.space.id
        }
      });

      const gitCoursePayload = rawGitCourseResponse?.data?.payload;
      if (!gitCoursePayload) {
        showErrorNotificationAndGoToCourses();
        return;
      }

      form.value = {
        uuid: uuid as string,
        courseJsonUrl: gitCoursePayload.courseJsonUrl,
        publishStatus: gitCoursePayload.publishStatus as GuideCoursePublishStatus,
        weight: gitCoursePayload.weight
      };

      const gitCourseSummarizedResponse = await apolloClient.query<GitCourseSummarized, GitCourseSummarizedVariables>({
        query: gitCourseSummarized,
        variables: {
          key: uuid as string,
          spaceId: props.space.id
        }
      });

      gitCourse.value = gitCourseSummarizedResponse?.data?.payload;

      gitCourseLoaded.value = true;
    } catch (e) {
      showErrorNotificationAndGoToCourses();
    }
  } else {
    gitCourseLoaded.value = true;
  }
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
      <div v-if="gitCourseLoaded">
        <div class="px-4 md:px-0 overflow-hidden">
          <router-link
            :to="
              uuid
                ? {
                    name: 'guideBundle',
                    params: { key: space.id, uuid }
                  }
                : { name: 'guideBundles' }
            "
            class="text-color"
          >
            <Icon name="back" size="22" class="!align-middle" />
            {{ uuid ? gitCourse?.title : 'Back to Courses' }}
          </router-link>

          <UiSidebarButton v-if="preview" @click="preview = false" class="float-right">
            <Icon name="back" size="18" />
          </UiSidebarButton>
        </div>
        <template>
          <Block :title="$t('courses.create.basicInfo')" :class="`mt-4`">
            <div class="mb-2">
              <UiInput v-model="form.name" min="10" maxlength="32">
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
          <UiButton
            @click="clickSubmit"
            :disabled="!isValid"
            :loading="clientLoading || gitCourseUpserting"
            class="block w-full mt-4"
            variant="contained"
            primary
          >
            {{ $t('create.publish') }}
          </UiButton>
        </template>
      </div>
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
