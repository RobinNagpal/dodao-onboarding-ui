export interface Guide {
  from?: string;
  space: string;
  timestamp?: number;
  title: string;
  body: string;
  start: number;
  end: number;
  network: string;
  metadata: string;
}

export const guideTypes = {
  Guide: [
    { name: 'from', type: 'address' },
    { name: 'space', type: 'string' },
    { name: 'timestamp', type: 'uint64' },
    { name: 'title', type: 'string' },
    { name: 'body', type: 'string' },
    { name: 'start', type: 'uint64' },
    { name: 'end', type: 'uint64' },
    { name: 'network', type: 'string' },
    { name: 'metadata', type: 'string' }
  ]
};
