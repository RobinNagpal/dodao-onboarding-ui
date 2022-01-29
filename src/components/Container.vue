<script setup>
defineProps({
  slim: Boolean
});
</script>

<template>
  <div
    :class="slim ? 'px-0 md:px-4' : 'px-4'"
    class="container-default w-container mx-auto"
  >
    <slot />
  </div>
</template>
