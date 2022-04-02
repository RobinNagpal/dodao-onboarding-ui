<script setup lang="ts">
import Icon from '@/components/Icon.vue';
import UiInput from '@/components/Ui/Input.vue';
import UiSidebarButton from '@/components/Ui/SidebarButton.vue';
import { QuestionError, UserInputError } from '@/types/error';
import {
  InputType,
  UserInput
} from '@dodao/onboarding-schemas/models/GuideModel';
import { PropType } from 'vue';
import Checkbox from '@/components/Checkbox.vue';

defineProps({
  removeUserInput: { type: Function, required: true },
  userInput: {
    type: Object as PropType<UserInput>,
    required: true
  },
  userInputErrors: { type: Object as PropType<UserInputError> },
  updateUserInputLabel: { type: Function, required: true },
  updateUserInputPrivate: { type: Function, required: true },
  updateUserInputRequired: { type: Function, required: true }
});
</script>

<template>
  <UiSidebarButton
    class="float-right my-2 mr-4"
    :aria-label="$t('toggleSkin')"
    @click="removeUserInput(userInput.uuid)"
  >
    <Icon size="20" class="link-color" name="close" />
  </UiSidebarButton>
  <div class="border md:rounded-lg p-4 mb-4 bg-skin-block-bg">
    <UiInput maxlength="64" :disabled="true">
      <template v-slot:label
        ><UiInput
          maxlength="64"
          :modelValue="userInput.label"
          class="border-r-2"
          :class="{
            '!border-red border rounded-lg': userInputErrors?.label
          }"
          :hideBorder="true"
          @update:modelValue="updateUserInputLabel(userInput.uuid, $event)"
        />
      </template>
    </UiInput>
    <div class="flex mt-2">
      <Checkbox
        @update:modelValue="updateUserInputRequired(userInput.uuid, $event)"
        :modelValue="userInput.required"
      />
      <div class="mt-2">
        {{ $t('form.required') }}
      </div>
    </div>
    <div class="flex mt-2">
      <Checkbox
        @update:modelValue="updateUserInputPrivate(userInput.uuid, $event)"
        :modelValue="userInput.type === InputType.PrivateShortInput"
      />
      <div class="mt-2">
        {{ $t('form.private') }}
      </div>
    </div>
  </div>
</template>
