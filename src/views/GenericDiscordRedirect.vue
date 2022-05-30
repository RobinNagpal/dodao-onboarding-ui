<script setup lang="ts">
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { getUserInfo } from '@/helpers/discord/discordApi';
import guideSubmissionCache from '@/helpers/guideSubmissionCache';
import { setPageTitle } from '@/helpers/utils';
import { UserDiscordInfo } from '@dodao/onboarding-schemas/models/GuideSubmissionModel';
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
  const spaceId = params.get('spaceId');
  if (target === 'space') {
    const code = route.query?.code?.toString();
    await router.push({
      name: 'spaceDiscord',
      params: { key: spaceId, discordCode: code }
    });
  } else if (target === 'guideView') {
    const guideUuid = params.get('guideUuid')!;
    const discordUser: any = await getUserInfo(accessToken);
    const stepOrder: string = params.get('stepOrder')!;
    const stepUuid: string = params.get('stepUuid')!;
    const itemUuid: string = params.get('itemUuid')!;

    const discordUserInfo: UserDiscordInfo = {
      ...discordUser,
      accessToken
    };

    guideSubmissionCache.setUserDiscordInSubmission(
      guideUuid,
      parseInt(stepOrder),
      stepUuid,
      itemUuid,
      discordUserInfo
    );

    const guideType = params.get('guideType');
    await router.push({
      name: 'guide',
      params: {
        key: spaceId,
        guideType: guideType,
        uuid: guideUuid,
        stepOrder: stepOrder,
        stepUuid: stepUuid
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
