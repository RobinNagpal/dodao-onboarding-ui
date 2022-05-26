<script setup lang="ts">
import { PropType, ref } from 'vue';
import { InputType, QuestionType, UserDiscordConnect } from '@dodao/onboarding-schemas/models/GuideModel';
import { toRefs } from 'vue';
import UiModal from '@/components/Ui/Modal.vue';
import UiButton from '@/components/Ui/Button.vue';

defineProps({
  removeDiscord: { type: Function, required: true },
  userDiscord: {
    type: Object as PropType<UserDiscordConnect>,
    required: true
  }
});

const open = ref(false);

const toggleModal = value => {
  open.value = value;
};
</script>
<template>
  <div class="w-full flex justify-center">
    <div class="mb-4">
      <a @click="toggleModal(true)" class="relative text-white discord-btn inline-flex button px-[24px]">
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 100 100" viewBox="0 0 100 100">
          <path
            fill="white"
            d="M85.778,24.561c-11.641-8.71-22.793-8.466-22.793-8.466s-1.14,1.302-1.14,1.302c13.839,4.152,20.27,10.257,20.27,10.257   c-19.799-10.901-45.019-10.823-65.613,0c0,0,6.675-6.431,21.328-10.583c0,0-0.814-0.977-0.814-0.977s-11.071-0.244-22.793,8.466   c0,0-11.722,21.084-11.722,47.052c0,0,6.838,11.722,24.829,12.292c0,0,3.012-3.582,5.454-6.675   c-10.339-3.093-14.246-9.524-14.246-9.524c6.495,4.064,13.063,6.608,21.247,8.222c13.316,2.741,29.879-0.077,42.249-8.222   c0,0-4.07,6.594-14.734,9.606c2.442,3.012,5.373,6.512,5.373,6.512C90.662,83.254,97.5,71.532,97.5,71.613   C97.5,45.645,85.778,24.561,85.778,24.561z M34.818,64.043c-4.559,0-8.303-3.989-8.303-8.955c0.333-11.892,16.357-11.855,16.607,0   C43.121,60.054,39.458,64.043,34.818,64.043z M64.531,64.043c-4.559,0-8.303-3.989-8.303-8.955c0.366-11.869,16.19-11.874,16.607,0   C72.834,60.054,69.171,64.043,64.531,64.043z"
          />
        </svg>
        <div class="h-[32px] w-full overflow-hidden rounded-full mr-2 items-center justify-center">
          <span class="text-white ml-2">
            {{ $t('guide.create.connectDiscord') }}
            <span class="text-white removeDiscord right-2 top-0 absolute" @click="removeDiscord(userDiscord.uuid)">
              <Icon size="20" class="link-color" name="close" />
            </span>
          </span>
        </div>
      </a>
    </div>
  </div>
  <teleport to="#modal">
    <UiModal :open="open" @close="toggleModal(false)">
      <template v-slot:header>
        <h3>{{ $t('guide.create.connectDiscord') }}</h3>
      </template>
      <div>
        <div class="m-4 space-y-2">
          {{ $t('guide.discordPoupDesc') }}
        </div>
      </div>
      <template v-slot:footer>
        <div class="flex justify-end">
          <UiButton @click="toggleModal(false)" :primary="true" variant="contained">
            {{ $t('Close') }}
          </UiButton>
        </div>
      </template>
    </UiModal>
  </teleport>
</template>
<style scoped lang="scss">
.removeDiscord {
  .iconclose {
    color: white !important;
  }
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
