import domains from '@/helpers/jsons/dodao_domains.json';

export function useSpaceSkin() {
  const domainName = window.location.hostname;
  let env = 'master';
  if (domainName.includes('localhost')) env = 'local';
  if (domainName === 'demo.snapshot.org') env = 'develop';
  let spaceId = domains[domainName];

  if (env === 'local') {
    spaceId = import.meta.env.VITE_VIEW_AS_SPACE_WITH_SKIN ?? spaceId;
  }

  return { spaceIdForDomain: spaceId };
}
