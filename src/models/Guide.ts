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
  questionType: QuestionType;
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

export interface Guide {
  content: string;
  from?: string;
  id?: string;
  metadata: string;
  name: string;
  network: string;
  space: string;
  steps: GuideStep[];
  timestamp?: number;
  uuid: string;
}
