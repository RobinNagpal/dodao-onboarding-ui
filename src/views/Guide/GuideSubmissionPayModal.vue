<script setup lang="ts">
import { ExtendedSpace_space, GuideSubmissionsQuery_guideSubmissions } from '@/graphql/generated/graphqlDocs';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { ref, defineExpose, PropType } from 'vue';
const props = defineProps({
  open: Boolean,
  space: { type: Object as PropType<SpaceModel>, required: true },
  submissionSelectiona: {
    type: Object as PropType<GuideSubmissionsQuery_guideSubmissions[]>,
  } 
})

const emit = defineEmits(['close']);

const selectWallet = ref();
</script>

<template>
  <UiModal :open="open" @close="$emit('close')" class="flex">
    <template v-slot:header>
      <h3>Batch Pay</h3>
      <div>Pay the following submissions</div>
    </template>
    <div class="flex flex-col flex-auto my-2 mx-2">
        <UiDropdown
          top="2.5rem"
          right="1.5rem"
          class="flex-1 ml-1 cursor-pointer dropdown-wallet"
          @select="selectWallet = $event"
          :items="space.spaceIntegrations?.gnosisSafeWallets"
        >
          <UiInput
            :modelValue="selectWallet ? selectWallet?.name + selectWallet?.address : ''"
            class="flex-1 !cursor-pointer"
            placeholder="0x00..."
            :disabled="true"
          >
            <template v-slot:label>Select Your Wallet</template>
          </UiInput>
          <template v-slot:item="{ item }">
            {{ item.name + ': ' + item.address }}
          </template>
        </UiDropdown>
    </div>
    <template v-slot:footer>
      <div class="flex justify-around">
        <UiButton variant="contained" primary>Ok</UiButton>
        <UiButton >Cancel</UiButton>
      </div>
    </template>
  </UiModal>
</template>
<style lang="scss">
.dropdown-wallet {
  .sub-menu-wrapper {
    width: 100%;
  }
}
</style>