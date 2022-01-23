export const guideTypes = {
  QuestionChoice: [
    { name: 'key', type: 'string' },
    { name: 'content', type: 'string' }
  ],
  Question: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'excerpt', type: 'string' },
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
    { name: 'from', type: 'address' },
    { name: 'space', type: 'string' },
    { name: 'timestamp', type: 'uint64' },
    { name: 'name', type: 'string' },
    { name: 'content', type: 'string' },
    { name: 'steps', type: 'Step[]' },
    { name: 'network', type: 'string' },
    { name: 'metadata', type: 'string' }
  ]
};
