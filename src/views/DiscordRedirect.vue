<script setup lang="ts">
import {
  AddDiscordCredentials_payload,
  AddDiscordCredentialsVariables
} from '@/graphql/generated/graphqlDocs';
import { useMutation } from '@vue/apollo-composable';
import { addDiscordCredentials } from '@/graphql/space/addDiscordCredentials.mutation.graphql';
import { setPageTitle } from '@/helpers/utils';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const { mutate } = useMutation<
  AddDiscordCredentials_payload,
  AddDiscordCredentialsVariables
>(addDiscordCredentials);

onMounted(() => {
  setPageTitle('page.title.home');
  const code = route.query?.code?.toString();
  const redirectUrl = route.query?.state?.toString();

  if (code && redirectUrl) {
    mutate({
      code,
      spaceId: 'spaceId'
    });
    //CALL API
    // THEN REDIRECT
    // router.push({
    //   path: redirectUrl,
    //   query: {}
    // })
  }
});
</script>

<template>
  <div class="flex justify-center items-center mt-[300px]">
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid var(--primary-color);
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: var(--primary-color) transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
