<script setup lang="ts">
import { GuideQuestion } from '@dodao/onboarding-schemas/models/GuideModel';
import { PropType } from 'vue';

const props = defineProps({
  addChoice: Function,
  question: {
    type: Object as PropType<GuideQuestion>,
    required: true
  },
  questionErrors: Object,
  removeChoice: Function,
  removeQuestion: Function,
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
    <Icon size="20" class="link-color" name="close" />
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
      <div class="flex">
        <Checkbox
          @update:modelValue="updateAnswers(question.uuid, choice.key, $event)"
          :modelValue="question.answerKeys.includes(choice.key)"
          :class="{ 'border-2 border-red': questionErrors?.answerKeys }"
        />
        <UiInput
          :modelValue="choice.content"
          maxlength="64"
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
    <UiButton
      v-if="!disableChoiceEdit"
      @click="addChoice(question.uuid)"
      class="block w-full"
    >
      {{ $t('create.addChoice') }}
    </UiButton>
  </div>
</template>
