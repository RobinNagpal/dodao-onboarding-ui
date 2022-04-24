import { GuideBundleType } from '@dodao/onboarding-schemas/models/GuideBundleModel';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { v4 as uuidv4 } from 'uuid';

export interface TempGuideModelInput {
  order: number;
  uuid: string;
  guide?: {
    content: string;
    name: string;
    thumbnail?: string | null;
    uuid: string;
  };
}

export interface TempGuideBundleInput {
  uuid: string;
  bundleGuides: TempGuideModelInput[];
  bundleType: GuideBundleType;
  categories: string[];
  content: string;
  discordWebhook?: string;
  excerpt: string;
  from: string;
  name: string;
  space: string;
  thumbnail?: string;
  timestamp?: number;
}

export const emptyGuideBundle = (
  from: string,
  space: SpaceModel,
  bundleType: GuideBundleType
): TempGuideBundleInput => {
  return {
    bundleType,
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
