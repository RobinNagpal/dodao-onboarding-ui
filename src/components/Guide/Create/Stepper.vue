<script setup lang="ts">
import GuideCreateStepperItem from '@/components/Guide/Create/StepperItem.vue';
import {
  GuideInput,
  GuideStepInput
} from '@dodao/onboarding-schemas/inputs/GuideInput';
import { computed, PropType, unref } from 'vue';

const props = defineProps({
  activeStepId: String,
  guide: {
    type: Object as PropType<GuideInput>,
    required: true
  },
  guideErrors: Object,
  steps: {
    type: Array as PropType<Array<GuideStepInput>>,
    required: true
  },
  errorColor: {
    type: String,
    default: '#d32f2f'
  },
  successColor: {
    type: String,
    default: '#00813a'
  },
  primaryColor: {
    type: String,
    default: '#069'
  },
  setActiveStep: Function,
  updateStep: Function,
  addStep: Function,
  moveStepUp: Function,
  moveStepDown: Function,
  removeStep: Function,
});

const errors = unref(props.guideErrors);

const activeStep = computed(() =>
  props.steps.find(step => step.uuid === props.activeStepId)
);

const styleObject = computed(
  () => {
    return {
      "--error-color": props.errorColor,
      "--success-color": props.successColor,
      "--primary-color": props.primaryColor
    }
  }
);
</script>
<template>
  <div class="w-full flex flex-row">
    <div class="p-4 bg-skin-header-bg rounded-3xl">
      <ol class="ob-nav-stepper ob-nav-stepper-lg" role="menu" :style="styleObject">
        <li
          @click="setActiveStep(step.uuid)"
          class="ob-nav-step"
          role="presentation"
          v-for="step in steps"
          :key="step.uuid"
          :class="{
            active: step.uuid === activeStep.uuid,
            error: errors.steps?.[step.order],
            success: !errors.steps?.[step.order]
          }"
        >
          <div v-if="!errors.steps?.[step.order]" class="checkmark"></div>
          <a class="step-link" role="menuitem">{{ step.name || '&nbsp;' }}</a>
        </li>

        <li
          class="ob-nav-step"
          role="presentation"
          data-step-label="+"
          @click="addStep"
        >
          <a href="#nav-stepper-4" class="step-link" role="menuitem">Add </a>
        </li>
      </ol>
    </div>
    <GuideCreateStepperItem
      :guide="guide"
      :step="activeStep"
      :stepErrors="errors.steps?.[activeStep.order]"
      @update:step="updateStep"
      :moveStepUp="moveStepUp"
      :moveStepDown="moveStepDown"
      :removeStep="removeStep"
    />
  </div>
</template>
<style scoped lang="scss">
// https://oblique.bit.admin.ch/components/stepper#stepper-snippet-source
.checkmark {
  position: absolute;
  width: 38px;
  left: 0;
  height: 38px;
  text-align: center;
  background-color: var(--success-color);
  border: 1px solid var(--success-color);
  border-radius: 50%;
  box-shadow: 0 0 2px 2px #fff;
  z-index: 1;
  &:after {
    content: '';
    left: 14px;
    top: 6px;
    width: 8px;
    height: 17px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    position: absolute;
  }
}

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

  .ob-nav-step.error {
    &::before {
      color: white;
      background-color: var(--error-color);
      border: 1px solid rgba(255, 56, 86, var(--tw-border-opacity));
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
      &:not(:last-child) {
        padding-bottom: 32px;
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
      line-height: 36px;
    }
  }
  .ob-step-link {
    font-size: 16px;
    line-height: 36px;
  }
  .ob-step-title {
    font-size: 16px;
    line-height: 36px;
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
