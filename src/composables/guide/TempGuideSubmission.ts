export type UserGuideQuestionSubmission = Record<string, string[] | string>;

export type GuideResponses = Record<string, UserGuideQuestionSubmission>;

export interface TempGuideSubmission {
  responses: GuideResponses;
  activeStepOrder: number;
}
