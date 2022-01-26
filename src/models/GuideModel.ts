export enum QuestionType {
  SingleChoice = 'SingleChoice',
  MultipleChoice = 'MultipleChoice'
}

export interface QuestionChoice {
  content: string;
  key: string;
  order: number;
}

export interface GuideQuestion {
  answerKeys: string[];
  choices: QuestionChoice[];
  content: string;
  order: number;
  questionType: QuestionType | string;
  uuid: string;
}

export interface GuideStep {
  content: string;
  id?: string;
  name: string;
  order: number;
  questions: GuideQuestion[];
  uuid: string;
}

export interface GuideModel {
  content: string;
  from?: string;
  id?: string;
  // TODO: check if this is really needed
  metadata: string | { network: string };
  name: string;
  // TODO: check if this is really needed
  network: string;
  space: string;
  steps: GuideStep[];
  timestamp?: number;
  uuid: string;
}
