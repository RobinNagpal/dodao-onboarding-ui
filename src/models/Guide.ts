export enum QuestionType {
  SingleChoice = 'SingleChoice',
  MultipleChoice = 'MultipleChoice'
}

export interface QuestionChoice {
  key: string;
  content: string;
  order: number;
}

export interface GuideQuestion {
  id: string;
  content: string;
  choices: QuestionChoice[];
  answerKeys: string[];
  questionType: QuestionType;
  order: number;
}

export interface GuideStep {
  id: string;
  name: string;
  content: string;
  questions: GuideQuestion[];
  order: number;
}

export interface Guide {
  id?: string;
  from?: string;
  space: string;
  timestamp?: number;
  name: string;
  content: string;
  steps: GuideStep[];
  network: string;
  metadata: {
    network: string;
  };
}
