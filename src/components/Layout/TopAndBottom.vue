<script setup lang="ts">
import Icon from '@/components/Icon.vue';
import { computed } from 'vue';

const browserHasHistory = computed(() => window.history.state.back);
</script>

<template>
  <div class="section mt-4">
    <div class="container-default">
      <div>
        <div class="integration-content">
          <slot />
          <div
            class="top-content card integration-main-card integration-card-top-content"
          >
            <div class="px-4 md:px-0">
              <a
                class="text-color"
                @click="
                  browserHasHistory
                    ? $router.go(-1)
                    : $router.push(domain ? { path: '/' } : { name: 'guide' })
                "
              >
                <Icon name="back" size="22" class="!align-middle" />
                {{ browserHasHistory ? $t('back') : space.name }}
              </a>
            </div>
            <div
              class="flex integration-top-content"
              v-if="$slots['top-content']"
            >
              <slot name="top-content" />
            </div>
          </div>
          <div
            class="split-content integration-card-content"
            v-if="$slots['content-bottom']"
          >
            <slot name="content-bottom" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
