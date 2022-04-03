import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { v4 as uuidv4 } from 'uuid';

export interface TempGuideModelInput {
  order: number;
  uuid: string;
  guideUuid?: string;
}

export interface TempGuideBundleInput {
  from: string;
  categories: string[];
  excerpt: string;
  content: string;
  discordWebhook?: string;
  name: string;
  space: string;
  bundleGuides: TempGuideModelInput[];
  thumbnail?: string;
  timestamp?: number;
  uuid: string;
}

export const emptyGuideBundle = (
  from: string,
  space: SpaceModel
): TempGuideBundleInput => {
  return {
    from,
    excerpt: 'Provides information for ....',
    uuid: uuidv4(),
    name: 'Guide Bundle ******',
    categories: [],
    content:
      'Some detailed content in Markdown format to tell about the bundle',
    bundleGuides: [
      {
        uuid: uuidv4(),
        order: 0
      }
    ],
    space: space.id
  };
};
