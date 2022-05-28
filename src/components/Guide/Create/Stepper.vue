<script setup lang="ts">
import GuideCreateStepperItem from '@/components/Guide/Create/StepperItem.vue';
import GuideStepperIcon from '@/components/Guide/StepperIcon.vue';
import { EditGuideType, UpdateGuideFunctions } from '@/composables/guide/useEditGuide';
import { GuideStepInput } from '@dodao/onboarding-schemas/inputs/GuideInput';
import { UserDiscordConnectType } from '@dodao/onboarding-schemas/models/GuideModel';
import { computed, PropType, unref } from 'vue';

const props = defineProps({
  activeStepId: String,
  guide: {
    type: Object as PropType<EditGuideType>,
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

  updateGuideFunctions: {
    type: Object as PropType<UpdateGuideFunctions>,
    required: true
  }
});

const errors = unref(props.guideErrors);

const activeStep = computed(() => props.steps.find(step => step.uuid === props.activeStepId));

const styleObject = computed(() => {
  return {
    '--error-color': props.errorColor,
    '--success-color': props.successColor
  };
});

const guideHasDiscordEnabled = computed<boolean>(() => {
  for (let i = 0; i < props.steps.length; i++) {
    for (let j = 0; j < props.steps[i].stepItems.length; j++) {
      if (props.steps[i].stepItems[j].type === UserDiscordConnectType) {
        return true;
      }
    }
  }
  return false;
});
</script>
<template>
  <div class="w-full flex flex-row">
    <div class="p-4 bg-skin-header-bg rounded-3xl">
      <ol class="ob-nav-stepper ob-nav-stepper-lg" role="menu" :style="styleObject">
        <li
          @click="updateGuideFunctions.setActiveStep(step.uuid)"
          class="ob-nav-step"
          role="presentation"
          v-for="step in steps"
          :key="step.uuid"
          :class="{
            active: step.uuid === activeStep.uuid,
            error: errors.steps?.[step.order],
            success: !errors.steps?.[step.order] && !guide.isPristine
          }"
        >
          <div v-if="!errors.steps?.[step.order] & !guide.isPristine" class="checkmark"></div>
          <GuideStepperIcon v-else-if="!errors.steps?.[step.order]" class="stepper-icon" :step="step" />
          <div class="step-link ml-2 -mt-1">
            <span class="text-xs font-medium">Step {{ step.order + 1 }}</span>
            <a class="step-link text-sm" role="menuitem">{{ step.name || '&nbsp;' }}</a>
          </div>
        </li>

        <li
          class="ob-nav-step flex items-center"
          role="presentation"
          data-step-label="+"
          @click="updateGuideFunctions.addStep"
        >
          <a class="step-link" role="menuitem">Add </a>
        </li>
      </ol>
    </div>
    <GuideCreateStepperItem
      :guide="guide"
      :guide-has-discord-enabled="guideHasDiscordEnabled"
      :step="activeStep"
      :stepErrors="errors.steps?.[activeStep.order]"
      @update:step="updateGuideFunctions.updateStep"
      :moveStepUp="updateGuideFunctions.moveStepUp"
      :moveStepDown="updateGuideFunctions.moveStepDown"
      :removeStep="updateGuideFunctions.removeStep"
    />
  </div>
</template>
<style scoped lang="scss">
// https://oblique.bit.admin.ch/components/stepper#stepper-snippet-source
.checkmark {
  position: absolute;
  top: 4px;
  left: 4px;
  height: 30px;
  width: 30px;
  text-align: center;
  background-color: var(--success-color);
  border: 1px solid var(--success-color);
  border-radius: 50%;
  z-index: 1;
  &:after {
    content: '';
    left: 11px;
    top: 6px;
    width: 6px;
    height: 14px;
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
      content: '';
      text-align: center;
      color: var(--primary-color);
      background-color: #fff;
      border: 1px solid #757575;
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
      border-color: #757575;
    }
    &:hover {
      &::before {
        background-color: #cce0eb;
      }
    }
    &:not(.disabled) {
      cursor: pointer;
    }
    .stepper-icon {
      position: absolute;
      top: 8px;
      left: 7px;
      text-align: center;
      border-radius: 50%;
      z-index: 1;
      color: #757575;
    }
    &.active {
      .stepper-icon {
        color: white;
      }
    }
  }
  .ob-nav-step.active {
    &:not(.success, .error):before {
      color: #fff;
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }
  }
  .ob-nav-step.success:not(.active) {
    &::before {
      color: var(--primary-color);
      background-color: var(--success-color);
      border-color: var(--success-color);
      content: '';
      box-shadow: none;
      background: transparent;
      border: 0;
    }
    &::after {
      border-color: var(--success-color);
      border-style: solid;
      .success {
        background-color: var(--success-color);
      }
    }
  }

  .ob-nav-step {
    &.active,
    &:hover {
      &.success::before {
        background: var(--success-color);
        border: 0;
        box-shadow: 0 0 14px 4px var(--success-color);
      }
      &.error::before {
        box-shadow: 0 0 2px 2px #fff, 0 0 8px 6px var(--error-color);
      }
    }
  }

  .ob-nav-step.error {
    &::before {
      content: '!';
      color: white;
      font-weight: bold;
      background-color: var(--error-color);
      border: 1px solid rgba(var(--error-color), var(--tw-border-opacity));
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
        top: 8px;
        bottom: -4px;
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
