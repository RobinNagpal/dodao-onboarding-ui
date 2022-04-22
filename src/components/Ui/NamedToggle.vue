<!-- Code has been taken from https://codepen.io/demilad/pen/bZRjpb -->
<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue']);

const input = ref(false);

function handleToggle() {
  input.value = !input.value;
  emit('update:modelValue', input.value);
}
</script>

<template>
  <div class="named-switch">
    <input
      type="checkbox"
      id="switch"
      @change="handleToggle"
      :checked="props.modelValue"
    />
    <div class="app">
      <div class="body">
        <div class="container">
          <div class="content">
            <label for="switch">
              <div class="toggle"></div>
              <div class="names pt-2">
                <p class="light">Guides</p>
                <p class="dark ml-5">Bundles</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.named-switch {
  /* Phone */
  .container {
    width: 200px;
    background-color: inherit;
    display: flex;
    flex-direction: column;
  }

  .swipe {
    width: 40%;
    background-color: black;
    opacity: 0.15;
    border-radius: 10px;
    margin: 0.5rem auto;
  }

  /* Middle */
  .content {
    display: flex;
    flex-direction: column;
    //margin: auto;
    text-align: center;
    width: 100%;
    transform: translateY(5%);
    margin: 0 20px;
  }

  label,
  .toggle {
    height: 2.8rem;
    border-radius: 10px;
  }

  label {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    position: relative;
    cursor: pointer;
  }

  .toggle {
    position: absolute;
    width: 50%;
    background-color: #fff;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .names {
    font-size: 90%;
    font-weight: bolder;
    width: 80%;
    margin-left: 10%;
    margin-top: 0.5%;
    position: absolute;
    display: flex;
    justify-content: space-between;
    user-select: none;
  }

  /* Bottom */
  .skip {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .skip p {
    opacity: 0.55;
    font-size: 90%;
    cursor: pointer;
    transition: all 2s ease;
  }

  .skip p:hover {
    text-decoration: underline;
  }

  /* -------- Switch Styles ------------*/
  [type='checkbox'] {
    display: none;
  }

  /* Toggle */
  [type='checkbox']:checked + .app .toggle {
    transform: translateX(100%);
    background-color: white;
  }

  [type='checkbox']:checked + .app .dark {
    opacity: 1;
  }

  [type='checkbox']:checked + .app .light {
    opacity: 0.5;
  }
}
</style>
