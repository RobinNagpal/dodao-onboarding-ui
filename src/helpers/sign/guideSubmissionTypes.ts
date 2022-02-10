export const guideSubmissionTypes = {
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
    { name: 'guideUuid', type: 'string' },
    { name: 'space', type: 'string' },
    { name: 'steps', type: 'GuideStepResponse[]' },
    { name: 'timestamp', type: 'uint64' },
    { name: 'uuid', type: 'string' }
  ]
};
