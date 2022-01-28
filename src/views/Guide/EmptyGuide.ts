import { GuideInput } from '@dodao/onboarding-schemas/inputs/GuideInput';
import { QuestionType } from '@dodao/onboarding-schemas/models/GuideModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { v4 as uuidv4 } from 'uuid';

export const emptyGuide = (author: string, space: SpaceModel): GuideInput => {
  return {
    author,
    uuid: uuidv4(),
    name: 'Guide Name',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ',
    steps: [
      {
        uuid: uuidv4(),
        name: 'Introduction',
        content: `
      Some basic Git commands are:
      \`\`\`
      git status
      git add
      git commit
      \`\`\`
      `,
        questions: [],
        order: 0
      },
      {
        uuid: uuidv4(),
        name: 'Introduction Evaluation',
        content: ``,
        questions: [
          {
            uuid: uuidv4(),
            content: 'Dog or a Cat, Do or a Cat, Dog or a Cat',
            choices: [
              {
                key: 'dog_and_cat',
                content: 'Dog And Cat',
                order: 0
              },
              {
                key: 'dog_or_cat',
                content: 'Dog Or Cat',
                order: 1
              },
              {
                key: 'only_dog',
                content: 'Only Dog',
                order: 2
              },
              {
                key: 'only_cat',
                content: 'Only Cat',
                order: 3
              }
            ],
            answerKeys: ['dog_or_cat', 'only_dog', 'only_cat'],
            questionType: QuestionType.MultipleChoice,
            order: 0
          },
          {
            uuid: uuidv4(),
            content: 'True or False',
            choices: [
              {
                key: 'true',
                content: 'True',
                order: 0
              },
              {
                key: 'false',
                content: 'False',
                order: 1
              }
            ],
            answerKeys: ['true'],
            questionType: QuestionType.MultipleChoice,
            order: 1
          }
        ],

        order: 1
      }
    ],
    space: space.id
  };
};
