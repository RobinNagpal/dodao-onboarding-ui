export const spaceTypes = {
  Settings: [
    { name: 'about', type: 'string' },
    { name: 'admins', type: 'address[]' },
    { name: 'avatar', type: 'string' },
    { name: 'creator', type: 'address' },
    { name: 'categories', type: 'string[]' },
    { name: 'github', type: 'string' },
    { name: 'members', type: 'address[]' },
    { name: 'mission', type: 'string' },
    { name: 'network', type: 'string' },
    { name: 'terms', type: 'string' },
    { name: 'twitter', type: 'string' },
    { name: 'blockchain', type: 'string' }
  ],
  Space: [
    { name: 'from', type: 'address' },
    { name: 'space', type: 'string' },
    { name: 'timestamp', type: 'uint64' },
    { name: 'settings', type: 'Settings' }
  ]
};
