<script setup>
import { computed, inject, onMounted, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { clone, validateSchema } from '@snapshot-labs/snapshot.js/src/utils';
import spaceSchema from '@dodao/onboarding-schemas/schemas/space.json';
import networks from '@snapshot-labs/snapshot.js/src/networks.json';
import defaults from '@/locales/default';
import { setPageTitle } from '@/helpers/utils';
import { useClient } from '@/composables/useClient';

const props = defineProps({
  spaceId: String,
  space: Object,
  from: String,
  spaceFrom: Object,
  spaceLoading: Boolean,
  loadExtentedSpaces: Function
});

const basicValidation = { name: 'basic', params: {} };

const { t } = useI18n();
const { send, clientLoading } = useClient();
const notify = inject('notify');

const currentSettings = ref({});
const modalNetworksOpen = ref(false);
const modalSkinsOpen = ref(false);
const modalCategoryOpen = ref(false);
const modalValidationOpen = ref(false);
const loaded = ref(false);
const uploadLoading = ref(false);
const showErrors = ref(false);
const form = ref({
  name: undefined,
  categories: [],
  filters: {},
  validation: basicValidation
});

const validate = computed(() => {
  if (form.value.terms === '') delete form.value.terms;
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

async function handleSubmit() {
  if (isValid.value) {
    console.log('handleSubmit', JSON.stringify(form.value.name));
    if (form.value.filters.invalids) delete form.value.filters.invalids;
    const result = await send(
      { id: slugify(form.value.name) },
      'settings',
      form.value
    );
    console.log('Result', result);
    if (result.id) {
      notify(['green', t('notify.saved')]);
      props.loadExtentedSpaces([props.spaceId]);
    }
  } else {
    console.log('Invalid schema', validate.value);
    showErrors.value = true;
  }
}

function inputError(field) {
  if (!isValid.value && !clientLoading.value && showErrors.value) {
    const errors = Object.keys(defaults.errors);
    const errorFound = validate.value.find(
      error =>
        (errors.includes(error.keyword) &&
          error.params.missingProperty === field) ||
        (errors.includes(error.keyword) && error.instancePath.includes(field))
    );

    if (errorFound)
      return t(`errors.${errorFound.keyword}`, [errorFound?.params.limit]);
  }
}

function handleReset() {
  if (props.from) return (form.value = clone(props.spaceFrom));
  if (currentSettings.value) return (form.value = currentSettings.value);
  form.value = {
    categories: [],
    plugins: {},
    filters: {}
  };
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

watchEffect(async () => {
  if (!props.spaceLoading) {
    const spaceClone = formatSpace(props.space);
    if (spaceClone) {
      form.value = spaceClone;
      currentSettings.value = clone(spaceClone);
    }
    if (props.from) {
      const fromClone = formatSpace(props.spaceFrom);
      if (fromClone) {
        form.value = fromClone;
      }
    }
    loaded.value = true;
  }
});

onMounted(() => {
  props.space
    ? setPageTitle('page.title.space.settings', { space: props.space.name })
    : setPageTitle('page.title.setup');
});
</script>

<template>
  <Layout v-bind="$attrs">
    <template #content-left>
      <div v-if="space?.name" class="px-4 md:px-0 mb-3">
        <router-link :to="{ name: 'spaceProposals' }" class="text-color">
          <Icon name="back" size="22" class="!align-middle" />
          {{ space.name }}
        </router-link>
      </div>
      <div class="px-4 md:px-0">
        <h1 v-if="loaded" v-text="$t('setupSpace.header')" class="mb-4" />
        <PageLoading v-else />
      </div>
      <template v-if="loaded">
        <div v-if="space || isOwner">
          <Block :title="$t('setupSpace.profile')">
            <div class="mb-2">
              <UiInput v-model="form.name" :error="inputError('name')">
                <template v-slot:label>{{ $t(`settings.name`) }}*</template>
              </UiInput>
              <UiInput v-model="form.about" :error="inputError('about')">
                <template v-slot:label> {{ $t(`settings.about`) }} </template>
              </UiInput>
              <UiInput
                v-model="form.avatar"
                placeholder="e.g. https://example.com/space.png"
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
              <UiInput @click="modalCategoryOpen = true">
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
                v-model="form.twitter"
                placeholder="e.g. elonmusk"
                :error="inputError('twitter')"
              >
                <template v-slot:label>
                  <Icon name="twitter" />
                </template>
              </UiInput>
              <UiInput
                v-model="form.github"
                placeholder="e.g. vbuterin"
                :error="inputError('github')"
              >
                <template v-slot:label>
                  <Icon name="github" />
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
          <Block :title="$t('setupSpace.admins')" v-if="isOwner">
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
              />
            </UiButton>
          </Block>
          <Block :title="$t('setupSpace.authors')">
            <Block
              :style="`border-color: red !important`"
              v-if="inputError('members')"
            >
              <Icon name="warning" class="mr-2 !text-red" />
              <span class="!text-red"> {{ inputError('members') }}&nbsp;</span>
            </Block>
            <UiButton class="block w-full px-3" style="height: auto">
              <TextareaArray
                v-model="form.members"
                :placeholder="`0x8C28Cf33d9Fd3D0293f963b1cd27e3FF422B425c\n0xeF8305E140ac520225DAf050e2f71d5fBcC543e7`"
                class="input w-full text-left"
                style="font-size: 18px"
              />
            </UiButton>
          </Block>
          <Block :title="$t('actions')">
            <UiButton @click="handleReset" class="block w-full mb-2">
              {{ $t('reset') }}
            </UiButton>
            <UiButton
              :disabled="uploadLoading"
              @click="handleSubmit"
              :loading="clientLoading"
              class="block w-full"
              primary
            >
              {{ $t('save') }}
            </UiButton>
          </Block>
        </div>
      </template>
    </template>
  </Layout>
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
    <ModalCategory
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
