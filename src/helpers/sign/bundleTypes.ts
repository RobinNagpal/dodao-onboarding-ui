export const bundleTypes = {
  BundleGuideInput: [
    { name: 'order', type: 'uint64' },
    { name: 'uuid', type: 'string' },
    { name: 'guideUuid', type: 'uint64' }
  ],
  Bundle: [
    { name: 'from', type: 'address' },
    { name: 'categories', type: 'string[]' },
    { name: 'excerpt', type: 'string' },
    { name: 'content', type: 'string' },
    { name: 'discordWebhook', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'space', type: 'string' },
    { name: 'bundleGuides', type: 'BundleGuideInput[]' },
    { name: 'thumbnail', type: 'string' },
    { name: 'timestamp', type: 'uint64' },
    { name: 'uuid', type: 'string' }
  ]
};
