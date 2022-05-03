<script setup lang="ts">
import { setPageTitle } from '@/helpers/utils';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const props = defineProps({
  render: {
    type: Function,
    required: true
  },
  scope: {
    type: String,
    default: 'identify guilds guilds.join guilds.members.read email connections',
    required: true
  },
  clientId: {
    type: String,
    default: import.meta.env.VITE_DISCORD_CLIENT_ID
  },
  responseType: {
    type: String,
    default: 'code'
  }
});
console.log(7777, import.meta.env)
const route = useRoute();

const url = computed(() => {
  const params = {
    scope: props.scope,
    client_id: props.clientId,
    response_type: props.responseType,
    redirect_uri: `${window.location.origin}/discord-redirect`,
    state: route.fullPath
  };

  var query = Object.keys(params)
    .map(k => (k) + '=' + encodeURIComponent(params[k]))
    .join('&');
  
  return `https://discord.com/api/oauth2/authorize?${query}`
})

onMounted(() => {
  setPageTitle('page.title.home');
});
</script>

<template>
  <slot :url="url"></slot>
</template>
<style scoped lang="scss">
</style>
