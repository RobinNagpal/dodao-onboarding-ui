import { UserDiscordInfo } from '@dodao/onboarding-schemas/models/GuideSubmissionModel';

export type UserGuideQuestionSubmission = Record<string, string[] | string | UserDiscordInfo>;

export type GuideResponses = Record<string, UserGuideQuestionSubmission>;

export interface TempGuideSubmission {
  responses: GuideResponses;
  activeStepOrder: number;
}
