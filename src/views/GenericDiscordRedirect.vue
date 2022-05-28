<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { getUserInfo } from '@/helpers/discord/discordApi';
import { setPageTitle } from '@/helpers/utils';
import { GuideType } from '@dodao/onboarding-schemas/models/GuideModel';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  setPageTitle('page.title.home');
  const hash = window.location.hash.slice(1);
  let state = '';
  let accessToken = '';

  if (hash) {
    const fragment = new URLSearchParams(hash);
    accessToken = fragment.get('access_token') || '';
    state = fragment.get('state') || '';
  } else {
    state = route.query?.state?.toString() || '';
  }

  const params = new URLSearchParams(decodeURIComponent(state!));
  const target = params.get('target');
  if (target === 'space') {
    const code = route.query?.code?.toString();
    router.push({
      name: 'spaceDiscord',
      params: { key: params.get('spaceId'), discordCode: code }
    });
  } else if (target === 'guideView') {
    const guideUuid = params.get('guideUuid');
    const discordUser: any = await getUserInfo(accessToken);
    router.push({
      name: 'guide',
      params: {
        key: params.get('spaceId'),
        guideType: params.get('guideType'),
        uuid: guideUuid,
        stepOrder: params.get('stepOrder'),
        stepUuid: params.get('stepUuid'),
        discordId: discordUser.id,
        itemUuid: params.get('itemUuid')
      }
    });
  }
});
</script>

<template>
  <div class="wrapper">
    <LoadingSpinner />
  </div>
</template>
<style scoped>
.wrapper {
  margin-top: 100px;
}
</style>
