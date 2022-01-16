<script setup>
defineProps(['space']);
</script>
<template>
  <div class="mb-3 text-center">
    <Block class="pt-1">
      <p v-text="$t('guides.createFirstGuide')" class="mb-2" />
      <router-link :to="{ name: 'guideCreate', params: { key: space.id } }">
        <UiButton>
          {{ $t('guides.createGuide') }}
        </UiButton>
      </router-link>
    </Block>
  </div>
</template>
