import { GuideBundlePublishStatus } from '@dodao/onboarding-schemas/models/GuideBundleModel';
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
  categories: string[];
  content: string;
  discordWebhook?: string;
  duration: string;
  excerpt: string;
  from: string;
  highlights: string[];
  name: string;
  publishStatus: GuideBundlePublishStatus;
  socialShareImage?: string;
  space: string;
  thumbnail?: string;
  timestamp?: number;
}

export const emptyGuideBundle = (from: string, space: SpaceModel): TempGuideBundleInput => {
  return {
    from,
    excerpt: 'Provides information for ....',
    uuid: uuidv4(),
    name: 'Guide Bundle ******',
    categories: [],
    content: 'Some detailed content in Markdown format to tell about the bundle',
    duration: '30-45 mins',
    highlights: ['Basics of Web3', 'All the products of xxxx', 'xxx ecosystem', 'Business use-cases'],
    bundleGuides: [
      {
        uuid: uuidv4(),
        order: 0
      }
    ],
    publishStatus: GuideBundlePublishStatus.Live,
    space: space.id
  };
};
