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

export interface GuideError {
  name?: boolean;
  content?: boolean;
  steps?: Record<string, StepError>;
}

export interface GuideBundleError {
  name?: boolean;
  excerpt?: boolean;
  content?: boolean;
  bundleGuides?: { [key: string]: boolean };
}
