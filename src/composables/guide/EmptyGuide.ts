import { GuideInput } from '@dodao/onboarding-schemas/inputs/GuideInput';
import {
  InputType,
  QuestionType
} from '@dodao/onboarding-schemas/models/GuideModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { v4 as uuidv4 } from 'uuid';

export const emptyGuide = (from: string, space: SpaceModel): GuideInput => {
  return {
    from,
    uuid: uuidv4(),
    name: 'Guide Name',
    categories: [],
    content: 'New Guide',
    steps: [
      {
        uuid: uuidv4(),
        name: 'Introduction',
        content: `
Introduction Comments 
        `,
        stepItems: [
          {
            label: 'Full Name',
            order: 1,
            type: InputType.PublicShortInput,
            uuid: uuidv4()
          }
        ],
        order: 0
      },
      {
        uuid: uuidv4(),
        name: 'Introduction Evaluation',
        content: ``,
        stepItems: [
          {
            label: 'Full Name',
            order: 1,
            type: InputType.PublicShortInput,
            uuid: uuidv4()
          },
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
            type: QuestionType.MultipleChoice,
            order: 0
          }
        ],
        order: 1
      }
    ],
    space: space.id
  };
};
