export const guideTypes = {
  QuestionChoice: [
    { name: 'key', type: 'string' },
    { name: 'content', type: 'string' },
    { name: 'order', type: 'uint64' }
  ],
  Question: [
    { name: 'id', type: 'string' },
    { name: 'content', type: 'string' },
    { name: 'choices', type: 'QuestionChoice[]' },
    { name: 'answerKeys', type: 'string[]' },
    { name: 'questionType', type: 'string' },
    { name: 'order', type: 'uint64' }
  ],
  Step: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'content', type: 'string' },
    { name: 'questions', type: 'Question[]' },
    { name: 'order', type: 'uint64' }
  ],
  Guide: [
    { name: 'content', type: 'string' },
    { name: 'from', type: 'address' },
    { name: 'id', type: 'string' },
    { name: 'metadata', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'network', type: 'string' },
    { name: 'space', type: 'string' },
    { name: 'steps', type: 'Step[]' },
    { name: 'timestamp', type: 'uint64' }
  ]
};
