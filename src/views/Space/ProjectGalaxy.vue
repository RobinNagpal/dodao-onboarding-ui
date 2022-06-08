<script setup lang="ts">
import LayoutSingle from '@/components/Layout/Single.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiInput from '@/components/Ui/Input.vue';
import { useNotifications } from '@/composables/useNotifications';
import {
  UpsertProjectGalaxyAccessToken_payload,
  UpsertProjectGalaxyAccessTokenVariables
} from '@/graphql/generated/graphqlDocs';
import { UpsertProjectGalaxyAccessToken } from '@/graphql/space/projectGalaxy.mutation.graphql';
import { setPageTitle } from '@/helpers/utils';
import { SpaceForm } from '@/views/Space/SetupSpace.vue';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { useMutation } from '@vue/apollo-composable';
import { onMounted, PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  space: { type: Object as PropType<SpaceModel>, required: true },
  spaceId: String,
  spaceLoading: Boolean,
  discordCode: String
});

const { notify } = useNotifications();
const { t } = useI18n();
const savingAccessToken = ref(false);
const form = ref<{ projectGalaxyToken?: string }>({});

const { mutate: upsertProjectGalaxyAccessToken } = useMutation<
  UpsertProjectGalaxyAccessToken_payload,
  UpsertProjectGalaxyAccessTokenVariables
>(UpsertProjectGalaxyAccessToken);

async function clickSubmit() {
  if (form.value.projectGalaxyToken) {
    savingAccessToken.value = true;
    try {
      const payload = await upsertProjectGalaxyAccessToken({
        spaceId: props.space.id,
        accessToken: form.value.projectGalaxyToken
      });

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
          <UiInput v-model="form.projectGalaxyToken" maxlength="128">
            <template v-slot:label>{{ $t(`settings.accessToken`) }}*</template>
          </UiInput>
          <UiButton
            :disabled="!form.projectGalaxyToken || savingAccessToken"
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
