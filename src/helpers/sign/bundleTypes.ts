export const bundleTypes = {
  GuideInBundleInput: [
    { name: 'order', type: 'uint64' },
    { name: 'guideUuid', type: 'string' }
  ],
  GuideBundleInput: [
    { name: 'from', type: 'address' },
    { name: 'categories', type: 'string[]' },
    { name: 'excerpt', type: 'string' },
    { name: 'content', type: 'string' },
    { name: 'discordWebhook', type: 'string' },
    { name: 'duration', type: 'string' },
    { name: 'highlights', type: 'string[]' },
    { name: 'name', type: 'string' },
    { name: 'publishStatus', type: 'string' },
    { name: 'socialShareImage', type: 'string' },
    { name: 'space', type: 'string' },
    { name: 'bundleGuides', type: 'GuideInBundleInput[]' },
    { name: 'thumbnail', type: 'string' },
    { name: 'timestamp', type: 'uint64' },
    { name: 'uuid', type: 'string' }
  ]
};
