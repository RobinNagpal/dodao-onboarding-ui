export const guideTypes = {
  QuestionChoice: [
    { name: 'content', type: 'string' },
    { name: 'key', type: 'string' },
    { name: 'order', type: 'uint64' }
  ],
  Question: [
    { name: 'answerKeys', type: 'string[]' },
    { name: 'choices', type: 'QuestionChoice[]' },
    { name: 'content', type: 'string' },
    { name: 'order', type: 'uint64' },
    { name: 'questionType', type: 'string' },
    { name: 'uuid', type: 'string' }
  ],
  Step: [
    { name: 'content', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'order', type: 'uint64' },
    { name: 'questions', type: 'Question[]' },
    { name: 'uuid', type: 'string' }
  ],
  Guide: [
    { name: 'from', type: 'address' },
    { name: 'categories', type: 'string[]' },
    { name: 'content', type: 'string' },
    { name: 'discordWebhook', type: 'string' },
    { name: 'guideType', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'space', type: 'string' },
    { name: 'steps', type: 'Step[]' },
    { name: 'thumbnail', type: 'string' },
    { name: 'timestamp', type: 'uint64' },
    { name: 'uuid', type: 'string' }
  ]
};
