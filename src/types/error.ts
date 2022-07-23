import { GuideIntegrations } from '@dodao/onboarding-schemas/models/GuideModel';

export interface ChoiceError {
  content?: boolean;
}

export interface QuestionError {
  content?: boolean;
  choices?: Record<string, ChoiceError>;
  answerKeys?: boolean;
}

export interface UserInputError {
  label?: boolean;
}

export interface StepError {
  name?: boolean;
  content?: boolean;
  stepItems?: Record<string, QuestionError | UserInputError>;
}

export type KeyOfGuideIntegration = keyof GuideIntegrations;

export interface GuideError {
  name?: boolean;
  content?: boolean;
  steps?: Record<string, StepError>;
  guideIntegrations?: Partial<Record<KeyOfGuideIntegration, boolean | undefined>>;
}

export interface GuideCourseError {
  name?: boolean;
  excerpt?: boolean;
  content?: boolean;
  bundleGuides?: { [key: string]: boolean };
}
