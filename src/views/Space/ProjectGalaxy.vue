<script setup lang="ts">
import LayoutSingle from '@/components/Layout/Single.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiInput from '@/components/Ui/Input.vue';
import { useExtendedSpaces } from '@/composables/useExtendedSpaces';
import { useNotifications } from '@/composables/useNotifications';
import {
  ExtendedSpace_space,
  UpsertProjectGalaxyAccessToken_payload,
  UpsertProjectGalaxyAccessTokenVariables
} from '@/graphql/generated/graphqlDocs';
import { UpsertProjectGalaxyAccessToken } from '@/graphql/space/projectGalaxy.mutation.graphql';
import { setPageTitle } from '@/helpers/utils';
import { useMutation } from '@vue/apollo-composable';
import { computed, onMounted, PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { loadExtendedSpace } = useExtendedSpaces();

const props = defineProps({
  space: { type: Object as PropType<ExtendedSpace_space>, required: true },
  spaceId: String,
  spaceLoading: Boolean,
  discordCode: String
});

const { notify } = useNotifications();
const { t } = useI18n();
const savingAccessToken = ref(false);
const projectGalaxyTokenInput = ref<string | undefined>();

const projectGalaxyToken = computed(
  () =>
    projectGalaxyTokenInput.value ||
    props.space.spaceIntegrations?.projectGalaxyTokenLastFour?.replace(/^/, '************')
);

const { mutate: upsertProjectGalaxyAccessToken } = useMutation<
  UpsertProjectGalaxyAccessToken_payload,
  UpsertProjectGalaxyAccessTokenVariables
>(UpsertProjectGalaxyAccessToken);

async function clickSubmit() {
  if (projectGalaxyToken.value) {
    savingAccessToken.value = true;
    try {
      const payload = await upsertProjectGalaxyAccessToken({
        spaceId: props.space.id,
        accessToken: projectGalaxyTokenInput.value!
      });

      await loadExtendedSpace(props.space.id);
      projectGalaxyTokenInput.value = undefined;

      if (payload?.data?.id) {
        notify(['green', t('notify.saved')]);
      }
    } catch (e) {
      notify(['red', t('notify.somethingWentWrong')]);
      savingAccessToken.value = false;
    }

    savingAccessToken.value = false;
  }
}

onMounted(async () => {
  setPageTitle('page.title.home');
});
</script>

<template>
  <LayoutSingle v-bind="$attrs">
    <template #content>
      <h1 v-text="$t('settings.projectGalaxy')" class="flex-1 mt-3" />
      <div class="wrapper py-24 flex justify-center align-center flex-col items-center">
        <template v-if="!spaceLoading">
          <UiInput
            :model-value="projectGalaxyToken"
            @update:modelValue="projectGalaxyTokenInput = $event"
            maxlength="128"
          >
            <template v-slot:label>{{ $t(`settings.accessToken`) }}*</template>
          </UiInput>
          <UiButton
            :disabled="!projectGalaxyToken || savingAccessToken"
            @click="clickSubmit"
            :loading="savingAccessToken"
            class="block w-full"
            primary
          >
            {{ $t('save') }}
          </UiButton>
        </template>
        <LoadingSpinner v-else />
      </div>
    </template>
  </LayoutSingle>
</template>

<style scoped lang="scss">
.wrapper {
  min-height: 200px;
}
.discord-btn {
  border-radius: 0.5rem;
  background-color: #5964f3;
  color: white;
  border: 1px solid;
  outline: none;
  padding: 8px 16px;
  font-size: 18px;
  font-weight: 500;
  min-width: 220px;
  line-height: 36px;
  svg {
    height: 36px;
  }
}
</style>
