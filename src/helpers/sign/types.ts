export interface Position {
  from?: string;
  space: string;
  timestamp?: number;
  title: string;
  body: string;
  start: number;
  network: string;
  metadata: string;
}

export const positionTypes = {
  Position: [
    { name: 'from', type: 'address' },
    { name: 'space', type: 'string' },
    { name: 'timestamp', type: 'uint64' },
    { name: 'title', type: 'string' },
    { name: 'body', type: 'string' },
    { name: 'start', type: 'uint64' },
    { name: 'network', type: 'string' },
    { name: 'metadata', type: 'string' }
  ]
};
