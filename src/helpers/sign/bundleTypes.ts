export const bundleTypes = {
  GuideInBundleInput: [
    { name: 'order', type: 'uint64' },
    { name: 'guideUuid', type: 'string' }
  ],
  GuideBundleInput: [
    { name: 'from', type: 'address' },
    { name: 'bundleType', type: 'string' },
    { name: 'categories', type: 'string[]' },
    { name: 'excerpt', type: 'string' },
    { name: 'content', type: 'string' },
    { name: 'discordWebhook', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'space', type: 'string' },
    { name: 'bundleGuides', type: 'GuideInBundleInput[]' },
    { name: 'thumbnail', type: 'string' },
    { name: 'timestamp', type: 'uint64' },
    { name: 'uuid', type: 'string' }
  ]
};
