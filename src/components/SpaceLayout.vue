<template>
  <div class="section">
    <div class="container-default mt-24">
      <div class="card integration-main-card">
        <div class="integration-content">
          <slot />
          <div class="top-content integration-card-top-content">
            <div
              class="split integration-top-content"
              v-if="$slots['top-content']"
            >
              <slot name="top-content" />
            </div>
          </div>
          <div class="divider integration-card-divider"></div>
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
