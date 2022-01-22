export interface GuideStep {
  id: string;
  name: string;
}

export interface Guide {
  from?: string;
  space: string;
  timestamp?: number;
  name: string;
  content: string;
  steps: GuideStep[];
  network: string;
  metadata: string;
}

export const guideTypes = {
  Step: [
    { name: 'id', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'content', type: 'string' }
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
