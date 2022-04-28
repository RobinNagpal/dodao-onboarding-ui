<script setup lang="ts">
import Checkbox from '@/components/Checkbox.vue';
import Radio from '@/components/Radio.vue';
import TextareaAutosize from '@/components/TextareaAutosize.vue';
import Icon from '@/components/Icon.vue';
import UiButton from '@/components/Ui/Button.vue';
import UiInput from '@/components/Ui/Input.vue';
import UiSidebarButton from '@/components/Ui/SidebarButton.vue';
import { QuestionError } from '@/types/error';
import {
  GuideQuestion,
  QuestionType
} from '@dodao/onboarding-schemas/models/GuideModel';
import { PropType } from 'vue';

defineProps({
  addChoice: Function,
  question: {
    type: Object as PropType<GuideQuestion>,
    required: true
  },
  questionErrors: { type: Object as PropType<QuestionError> },
  removeChoice: Function,
  removeQuestion: Function,
  setAnswer: Function,
  updateChoiceContent: Function,
  updateQuestionDescription: Function,
  updateAnswers: Function
});

const disableChoiceEdit = false;
</script>

<template>
  <UiSidebarButton
    class="float-right my-2 mr-4"
    :aria-label="$t('toggleSkin')"
    @click="removeQuestion(question.uuid)"
  >
    <svg class="text-skin-text" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9 3.25h2c.69 0 1.25.56 1.25 1.25V5h-4.5v-.5c0-.69.56-1.25 1.25-1.25ZM6.5 5v-.5A2.5 2.5 0 0 1 9 2h2a2.5 2.5 0 0 1 2.5 2.5V5h3.375a.625.625 0 1 1 0 1.25H16V15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6.25h-.875a.625.625 0 1 1 0-1.25H6.5Zm7 1.25H5.25V15c0 .966.784 1.75 1.75 1.75h6A1.75 1.75 0 0 0 14.75 15V6.25H13.5ZM8.125 8h-.25v6h1.25V8h-1Zm2.75 1V8h1.25v6h-1.25V9Z" fill="currentColor"></path>
    </svg>
  </UiSidebarButton>
  <div class="border md:rounded-lg p-4 mb-4 bg-skin-block-bg">
    <UiButton
      class="w-full h-96 mb-4 px-[16px] flex items-center"
      style="height: max-content"
      :class="{ '!border-red': questionErrors?.content }"
    >
      <TextareaAutosize
        :value="question.content"
        :placeholder="$t(`guide.question.content`)"
        class="input w-full text-left"
        style="font-size: 18px"
        @update:modelValue="updateQuestionDescription(question.uuid, $event)"
      />
      <i
        class="iconfont iconwarning !text-red"
        data-v-abc9f7ae=""
        v-if="questionErrors?.content"
      ></i>
    </UiButton>
    <template v-for="choice in question.choices" :key="choice.key">
      <div class="flex items-center">
        <Radio
          v-if="question.type === QuestionType.SingleChoice"
          @update:modelValue="setAnswer(question.uuid, choice.key, $event)"
          :modelValue="question.answerKeys.includes(choice.key)"
          :class="{ 'border-2 border-red': questionErrors?.answerKeys }"
        />
        <Checkbox
          v-else
          @update:modelValue="updateAnswers(question.uuid, choice.key, $event)"
          :modelValue="question.answerKeys.includes(choice.key)"
          :class="{ 'border-2 border-red': questionErrors?.answerKeys }"
        />
        <UiInput
          :modelValue="choice.content"
          maxlength="256"
          :disabled="disableChoiceEdit"
          @update:modelValue="
            updateChoiceContent(question.uuid, choice.key, $event)
          "
          :error="questionErrors?.choices?.[choice.order]?.content"
        >
          <template v-slot:info>
            <span
              v-if="!disableChoiceEdit && question.choices.length > 1"
              class="cursor-pointer"
              @click="removeChoice(question.uuid, choice.key)"
            >
              <Icon name="close" size="12" />
            </span>
          </template>
        </UiInput>
      </div>
    </template>
    <button 
      @click="addChoice(question.uuid)" 
      v-if="!disableChoiceEdit" 
      class="m-auto rounded-full text-2xl bg-primary w-[48px] text-white flex items-center font-bold justify-center h-[48px]">
      <span class="mb-1">+</span>
    </button>
  </div>
</template>
