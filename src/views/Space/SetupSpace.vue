<script setup lang="ts">
import Block from '@/components/Block.vue';
import Icon from '@/components/Icon.vue';
import LayoutSingle from '@/components/Layout/Single.vue';
import ModalNetworks from '@/components/Modal/Networks.vue';
import ModalSkins from '@/components/Modal/Skins.vue';
import ModalSpaceCategory from '@/components/Modal/SpaceCategory.vue';
import ModalValidation from '@/components/Modal/Validation.vue';
import PageLoading from '@/components/PageLoading.vue';
import TextareaArray from '@/components/TextareaArray.vue';
import TextareaAutosize from '@/components/TextareaAutosize.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiInput from '@/components/Ui/Input.vue';
import { useApp } from '@/composables/useApp';
import { useClient } from '@/composables/useClient';
import { useExtendedSpaces } from '@/composables/useExtendedSpaces';
import { useModal } from '@/composables/useModal';
import { useWeb3 } from '@/composables/useWeb3';
import { getBlockchain, getNetworks } from '@/helpers/network';
import { setPageTitle } from '@/helpers/utils';
import defaults from '@/locales/default.json';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import spaceSchema from '@dodao/onboarding-schemas/schemas/space.json';
import { clone, validateSchema } from '@snapshot-labs/snapshot.js/src/utils';
import { ErrorObject } from 'ajv';
import { computed, inject, onMounted, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { loadExtentedSpaces, extentedSpaces } = useExtendedSpaces();
const networks = getNetworks();

export interface SpaceForm {
  avatar?: string;
  about?: string;
  admins?: string[];
  blockchain: string;
  creator?: string;
  categories?: string[];
  github?: string;
  members?: string[];
  mission?: string;
  name?: string;
  network?: string;
  skin: string;
  terms?: string;
  twitter?: string;
  validation: any;
}

const props = defineProps({
  spaceId: String,
  from: String,
  spaceFrom: Object
});

const basicValidation = { name: 'basic', params: {} };

const { t } = useI18n();
const { send, clientLoading } = useClient();
const { getExplore } = useApp();
const router = useRouter();

const notify: Function = inject('notify')!;

const modalNetworksOpen = ref(false);
const modalSkinsOpen = ref(false);
const modalCategoryOpen = ref(false);
const modalValidationOpen = ref(false);
const loaded = ref(false);
const uploadLoading = ref(false);
const showErrors = ref(false);
const space = ref<SpaceModel | undefined>();
const spaceLoading = ref<boolean>(false);
const { web3Account } = useWeb3();

console.log('props.spaceId', props.spaceId);

const form = ref<SpaceForm>({
  about: undefined,
  admins: [],
  avatar: undefined,
  blockchain: getBlockchain().toString(),
  categories: [],
  creator: undefined,
  members: [],
  github: undefined,
  mission: undefined,
  name: undefined,
  network: undefined,
  skin: 'dodao',
  terms: undefined,
  twitter: undefined,
  validation: basicValidation
});

const validate = computed(() => {
  return validateSchema(spaceSchema, form.value);
});

const isValid = computed(() => {
  return (
    !clientLoading.value && validate.value === true && !uploadLoading.value
  );
});

const isOwner = true;

const categoriesString = computed(() => {
  return form.value.categories ? form.value.categories.join(', ') : '';
});

function slugify(string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

const { modalAccountOpen } = useModal();

async function handleSubmit() {
  if (isValid.value) {
    const computedSpaceId =
      slugify(form.value.name) +
      '-' +
      getBlockchain().toLowerCase() +
      '-' +
      form.value.network;
    const id = props.spaceId || computedSpaceId;

    const result = await send(
      {
        id
      },
      'settings',
      form.value
    );
    console.log('Result', result);
    if (result?.id) {
      notify(['green', t('notify.saved')]);
      await loadExtentedSpaces([result.id]);
      await getExplore();
      await router.push({
        name: 'home'
      });
    }
  } else {
    console.log('Invalid schema', validate.value);
    showErrors.value = true;
  }
}

async function clickSubmit() {
  !web3Account.value ? (modalAccountOpen.value = true) : await handleSubmit();
}

function inputError(field) {
  if (!isValid.value && !clientLoading.value && showErrors.value) {
    const errors = Object.keys(defaults.errors);
    const errorFound = (validate.value as ErrorObject[]).find(
      error =>
        (errors.includes(error.keyword) &&
          error.params.missingProperty === field) ||
        (errors.includes(error.keyword) && error.instancePath.includes(field))
    );

    if (errorFound)
      return t(`errors.${errorFound.keyword}`, [errorFound?.params.limit]);
  }
}

function handleSubmitAddCategories(categories) {
  form.value.categories = categories;
}

function handleSubmitAddValidation(validation) {
  form.value.validation = clone(validation);
}

function setUploadLoading(s) {
  uploadLoading.value = s;
}

function setAvatarUrl(url) {
  if (typeof url === 'string') form.value.avatar = url;
}

function formatSpace(spaceRaw) {
  if (!spaceRaw) return;
  const space = clone(spaceRaw);
  if (!space) return;
  delete space.id;
  delete space._activeProposals;
  Object.entries(space).forEach(([key, value]) => {
    if (value === null) delete space[key];
  });
  space.validation = space.validation || basicValidation;
  space.filters = space.filters || {};
  return space;
}

function updateAdmins(value) {
  form.value.admins = value;
}

watchEffect(async () => {
  if (!spaceLoading.value) {
    if (props.from) {
      const fromClone = formatSpace(props.spaceFrom);
      if (fromClone) {
        form.value = fromClone;
      }
    }
    loaded.value = true;
  }
});

onMounted(async () => {
  try {
    if (props.spaceId) {
      spaceLoading.value = true;
      if (
        !extentedSpaces.value?.find(s => s.id === props.spaceId?.toString())
      ) {
        await loadExtentedSpaces([props.spaceId]);
      }
      const space = extentedSpaces.value.find(
        s => s.id === props.spaceId?.toString()
      );

      if (space) {
        form.value.about = space?.about || undefined;
        form.value.admins = space.admins;
        form.value.avatar = space?.avatar || undefined;
        form.value.categories = space.categories;
        form.value.creator = space?.creator || undefined;
        form.value.members = space?.members;
        form.value.github = space?.github || undefined;
        form.value.mission = space.mission;
        form.value.name = space.name || undefined;
        form.value.network = space.network;
        form.value.skin = space.skin;
        form.value.terms = space?.terms || undefined;
        form.value.twitter = space?.twitter || undefined;

        space
          ? setPageTitle('page.title.dao.settings', { space: space.name })
          : setPageTitle('page.title.setup');
      }
      spaceLoading.value = false;
    }
  } catch (e) {
    console.log(e);
  }
});
</script>

<template>
  <LayoutSingle v-bind="$attrs">
    <template #content>
      <div class="px-16">
        <div v-if="space?.name" class="px-4 md:px-0 mb-3">
          <router-link :to="{ name: 'spaceProposals' }" class="text-color">
            <Icon name="back" size="22" class="!align-middle" />
            {{ space.name }}
          </router-link>
        </div>
        <div class="px-4 md:px-0 flex mb-4">
          <h1 v-if="loaded" v-text="$t('setupDAO.header')" class="flex-1" />
          <PageLoading v-else />
          <router-link
            :to="{
              name: 'spaceDiscord',
              params: { key: spaceId, spaceId: spaceId }
            }"
          >
            <UiButton class="whitespace-nowrap" :primary="true">
              Discord
            </UiButton>
          </router-link>
        </div>
        <template v-if="loaded">
          <div v-if="space || isOwner">
            <Block :title="$t('setupDAO.profile')">
              <div class="mb-2">
                <UiInput
                  v-model="form.name"
                  :error="inputError('name')"
                  maxlength="32"
                >
                  <template v-slot:label>{{ $t(`settings.name`) }}*</template>
                </UiInput>
                <UiInput
                  v-model="form.mission"
                  :error="inputError('mission')"
                  :placeholder="
                    $t(`settings.missionStatementPlaceholder`) + ' *'
                  "
                  maxlength="64"
                >
                  <template v-slot:label
                    >{{ $t(`settings.missionStatement`) }}*</template
                  >
                </UiInput>
                <UiInput
                  v-model="form.avatar"
                  placeholder="e.g. https://example.com/dao.png"
                  :error="inputError('avatar')"
                >
                  <template v-slot:label>
                    {{ $t(`settings.avatar`) }}
                  </template>
                  <template v-slot:info>
                    <Upload
                      class="!ml-2"
                      @input="setAvatarUrl"
                      @loading="setUploadLoading"
                    >
                      {{ $t('upload') }}
                    </Upload>
                  </template>
                </UiInput>
                <UiInput
                  @click="modalNetworksOpen = true"
                  :error="inputError('network')"
                >
                  <template v-slot:selected>
                    {{
                      form.network
                        ? networks[form.network].name
                        : $t('selectNetwork')
                    }}
                  </template>
                  <template v-slot:label>
                    {{ $t(`settings.network`) }}*
                  </template>
                </UiInput>
                <UiInput
                  @click="modalCategoryOpen = true"
                  :class="{ 'mt-6': !categoriesString }"
                >
                  <template v-slot:label>
                    {{ $t(`settings.categories`) }}
                  </template>
                  <template v-slot:selected>
                    <span class="capitalize">
                      {{ categoriesString }}
                    </span>
                  </template>
                </UiInput>
                <UiInput
                  @click="modalSkinsOpen = true"
                  :error="inputError('skin')"
                >
                  <template v-slot:selected>
                    {{ form.skin }}
                  </template>
                  <template v-slot:label>
                    {{ $t(`settings.skin`) }}
                  </template>
                </UiInput>
                <UiInput
                  v-model="form.twitter"
                  placeholder="e.g. elonmusk"
                  :error="inputError('twitter')"
                >
                  <template v-slot:label>
                    <Icon name="twitter" />
                    {{ $t(`settings.twitter`) }}
                  </template>
                </UiInput>
                <UiInput
                  v-model="form.github"
                  placeholder="e.g. vbuterin"
                  :error="inputError('github')"
                >
                  <template v-slot:label>
                    <Icon name="github" />
                    {{ $t(`settings.github`) }}
                  </template>
                </UiInput>
                <UiInput
                  v-model="form.terms"
                  placeholder="e.g. https://example.com/terms"
                  :error="inputError('terms')"
                >
                  <template v-slot:label> {{ $t(`settings.terms`) }} </template>
                </UiInput>
              </div>
            </Block>
            <Block :title="$t('settings.about')" v-if="isOwner">
              <UiButton class="block w-full px-3 mb-2" style="height: auto">
                <TextareaAutosize
                  v-model="form.about"
                  :placeholder="$t(`settings.about`)"
                  class="input w-full text-left"
                  style="font-size: 18px"
                />
              </UiButton>
            </Block>
            <Block :title="$t('setupDAO.admins')" v-if="isOwner">
              <Block
                :style="`border-color: red !important`"
                v-if="inputError('admins')"
              >
                <Icon name="warning" class="mr-2 !text-red" />
                <span class="!text-red"> {{ inputError('admins') }}&nbsp;</span>
              </Block>
              <UiButton class="block w-full px-3" style="height: auto">
                <TextareaArray
                  v-model="form.admins"
                  :placeholder="`0x8C28Cf33d9Fd3D0293f963b1cd27e3FF422B425c\n0xeF8305E140ac520225DAf050e2f71d5fBcC543e7`"
                  class="input w-full text-left"
                  style="font-size: 18px"
                  @update:modelValue="updateAdmins($event)"
                />
              </UiButton>
            </Block>
            <UiButton
              :disabled="uploadLoading"
              @click="clickSubmit"
              :loading="clientLoading"
              class="block w-full"
              primary
            >
              {{ $t('save') }}
            </UiButton>
          </div>
        </template>
      </div></template
    >
  </LayoutSingle>
  <teleport to="#modal">
    <ModalNetworks
      v-model="form.network"
      :open="modalNetworksOpen"
      @close="modalNetworksOpen = false"
    />
    <ModalSkins
      v-model="form.skin"
      :open="modalSkinsOpen"
      @close="modalSkinsOpen = false"
    />
    <ModalSpaceCategory
      :open="modalCategoryOpen"
      :categories="form.categories"
      @close="modalCategoryOpen = false"
      @add="handleSubmitAddCategories"
    />
    <ModalValidation
      :open="modalValidationOpen"
      :validation="form.validation"
      @close="modalValidationOpen = false"
      @add="handleSubmitAddValidation"
    />
  </teleport>
</template>
