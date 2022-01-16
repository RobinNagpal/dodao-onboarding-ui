<script setup>
defineProps(['space']);
</script>
<template>
  <div class="mb-3 text-center">
    <Block class="pt-1">
      <p v-text="$t('positions.createFirstPosition')" class="mb-2" />
      <router-link :to="{ name: 'positionCreate', params: { key: space.id } }">
        <UiButton>
          {{ $t('positions.createPosition') }}
        </UiButton>
      </router-link>
    </Block>
  </div>
</template>
