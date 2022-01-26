<script setup lang="ts">
import { GuideStep } from '@/models/GuideModel';
import { computed, PropType } from 'vue';

const props = defineProps({
  activeStepId: String,
  steps: {
    type: Array as PropType<Array<GuideStep>>,
    required: true
  },
  goToNextStep: Function
});

const activeStep = computed(
  () =>
    props.steps.find(step => step.uuid === props.activeStepId) ||
    props.steps?.[0]
);

console.log(activeStep);
console.log(props.activeStepId);
</script>
<template>
  <div class="w-full flex flex-row">
    <div class="p-4">
      <ol class="ob-nav-stepper ob-nav-stepper-lg" role="menu">
        <li
          class="ob-nav-step"
          :class="step.uuid === activeStepId ? 'active' : 'disabled'"
          role="presentation"
          v-for="step in steps"
          :key="step.uuid"
        >
          <a class="step-link" role="menuitem">{{ step.name }}</a>
        </li>
        <li class="ob-nav-step disabled" role="presentation">
          <span class="step-link" role="menuitem">Done </span>
        </li>
      </ol>
    </div>
    <GuideViewStepperItem :step="activeStep" :goToNextStep="goToNextStep" />
  </div>
</template>
<style scoped lang="scss">
// https://oblique.bit.admin.ch/components/stepper#stepper-snippet-source
.ob-nav-stepper {
  .ob-nav-step.success.ob-feedback {
    &::before {
      content: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBvbHlnb24gcG9pbnRzPSI5LjUgMTcuMzU0IDQuNTg3IDEyLjQ0MiA1LjExOCAxMS45MTEgOS41IDE2LjI5NCAxOC44ODIgNi45MTEgMTkuNDEzIDcuNDQyIDkuNSAxNy4zNTQiIGZpbGw9IiMwMDgxM2EiLz48L3N2Zz4=');
    }
  }
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  list-style-type: none;
  margin-bottom: 0;
  padding-left: 20px;
  counter-reset: li-counter;
  .ob-nav-step {
    flex-basis: auto;
    flex-grow: 1;
    position: relative;
    &:before {
      content: counter(li-counter);
      counter-increment: li-counter;
      text-align: center;
      color: #069;
      background-color: #fff;
      border: 1px solid #069;
      border-radius: 50%;
      box-shadow: 0 0 2px 2px #fff;
      z-index: 1;
    }
    &:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-color: #069;
    }
    &:hover {
      &::before {
        background-color: #cce0eb;
      }
    }
    &:not(.disabled) {
      cursor: pointer;
    }
  }
  .ob-nav-step.active {
    &::before {
      color: #fff;
      background-color: #069;
      border-color: #069;
    }
    &::after {
      border-color: #069;
      border-style: solid;
    }
  }
  .ob-nav-step.success {
    &::before {
      color: #00813a;
      background-color: #fff;
      border-color: #00813a;
    }
    &::after {
      border-color: #00813a;
      border-style: solid;
    }
    &:hover {
      &::before {
        background-color: #c3e8cd;
      }
    }
  }
  .ob-nav-step.disabled {
    &::before {
      color: #757575;
      background-color: #fff;
      border-color: #757575;
    }
    &::after {
      border-color: #757575;
      border-style: solid;
    }
    .ob-step-link {
      color: #757575;
      cursor: default;
    }
  }
  .ob-nav-step[data-step-label] {
    &::before {
      content: attr(data-step-label);
    }
  }
  .step-link {
    display: block;
    text-decoration: none;
    margin-top: 8px;
  }
  &:not(.ob-nav-stepper-sm) {
    &:not(.ob-nav-stepper-lg) {
      .ob-nav-step {
        &::before {
          font-size: 12px;
          width: 26px;
          height: 26px;
          line-height: 25px;
        }
      }
      .ob-step-link {
        font-size: 12px;
        line-height: 28px;
      }
      .ob-step-title {
        font-size: 12px;
        line-height: 28px;
      }
      &:not(.ob-nav-horizontal) {
        .ob-nav-step {
          padding-left: 31.2px;
          &::after {
            left: 12px;
          }
        }
      }
    }
    &:not(.ob-nav-stepper-lg).ob-nav-horizontal {
      .ob-nav-step {
        &::after {
          top: 12px;
        }
      }
    }
  }
  &:not(.ob-nav-horizontal) {
    .ob-nav-step {
      &::before {
        position: absolute;
        left: 0;
      }
      &::after {
        border-left-width: 4px;
      }
      &:not(:first-child) {
        padding-top: 16px;
      }
      &:not(:last-child) {
        padding-bottom: 16px;
      }
    }
  }
}
.ob-font-awesome.ob-nav-stepper {
  .ob-nav-step.success.ob-feedback {
    &::before {
      content: 'ï€Œ';
      font-family: 'Font Awesome 5 Free';
      font-weight: 900;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }
}
.ob-nav-stepper.ob-nav-stepper-sm {
  .ob-nav-step {
    &::before {
      font-size: 10px;
      width: 16px;
      height: 16px;
      line-height: 15px;
    }
  }
  .ob-step-link {
    font-size: 10px;
    line-height: 18px;
  }
  .ob-step-title {
    font-size: 10px;
    line-height: 18px;
  }
  &:not(.ob-nav-horizontal) {
    .ob-nav-step {
      padding-left: 19.2px;
      &::after {
        left: 7px;
      }
    }
  }
}
.ob-nav-stepper.ob-nav-stepper-sm.ob-nav-horizontal {
  .ob-nav-step {
    &::after {
      top: 7px;
    }
  }
}
.ob-nav-stepper.ob-nav-stepper-lg {
  .ob-nav-step {
    &::before {
      font-size: 20px;
      width: 38px;
      height: 38px;
      line-height: 40px;
    }
  }
  .ob-step-link {
    font-size: 16px;
    line-height: 40px;
  }
  .ob-step-title {
    font-size: 16px;
    line-height: 40px;
  }
  &:not(.ob-nav-horizontal) {
    .ob-nav-step {
      padding-left: 45.6px;
      &::after {
        left: 18px;
      }
    }
  }
}
.ob-nav-stepper.ob-nav-stepper-lg.ob-nav-horizontal {
  .ob-nav-step {
    &::after {
      top: 18px;
    }
  }
}
.ob-nav-stepper.ob-nav-horizontal {
  flex-direction: row;
  text-align: center;
  .ob-nav-step {
    flex-grow: 0;
    &:not(:first-child) {
      padding-left: 16px;
    }
    &:not(:last-child) {
      padding-right: 16px;
    }
    &::before {
      position: relative;
      display: block;
      margin: auto;
    }
    &::after {
      border-top-width: 1px;
    }
    &:first-child {
      &::after {
        left: 50%;
      }
    }
    &:last-child {
      &::after {
        right: 50%;
      }
    }
  }
}
.ob-nav-stepper.ob-nav-horizontal.ob-full-width {
  .ob-nav-step {
    flex-grow: 1;
  }
}
</style>
