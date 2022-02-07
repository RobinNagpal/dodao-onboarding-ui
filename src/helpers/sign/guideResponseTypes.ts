export const guideResponseTypes = {
  GuideQuestionResponse: [
    { name: 'selectedAnswerKeys', type: 'string[]' },
    { name: 'uuid', type: 'string' }
  ],
  GuideStepResponse: [
    { name: 'questionResponses', type: 'GuideQuestionResponse[]' },
    { name: 'uuid', type: 'string' }
  ],
  Guide: [
    { name: 'from', type: 'address' },
    { name: 'steps', type: 'GuideStepResponse[]' },
    { name: 'timestamp', type: 'uint64' },
    { name: 'uuid', type: 'string' },
    { name: 'guideUuid', type: 'string' }
  ]
};
