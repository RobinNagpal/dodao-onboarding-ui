export interface ChoiceError {
  content?: boolean;
}

export interface QuestionError {
  content?: boolean;
  choices?: Record<string, ChoiceError>;
  answerKeys?: boolean;
}

export interface StepError {
  name?: boolean;
  content?: boolean;
  questions?: Record<string, QuestionError>;
}

export interface GuideError {
  name?: boolean;
  content?: boolean;
  steps?: Record<string, StepError>;
}
