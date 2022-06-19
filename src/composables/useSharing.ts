import { useCopy } from '@/composables/useCopy';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { useShare } from '@vueuse/core';

export function useSharing() {
  const { t } = i18n.global;

  const sharingItems = [
    {
      text: 'Twitter',
      action: 'shareToTwitter',
      icon: 'twitter'
    },
    {
      text: 'Facebook',
      action: 'shareToFacebook',
      icon: 'facebook'
    },
    {
      text: t('copyLink'),
      action: 'shareToClipboard',
      icon: 'insertlink'
    }
  ];

  function entitylUrl(space: string, entityUrl: string, uuid: string) {
    return `https://${window.location.hostname}/#/${space}/${entityUrl}/${uuid}`;
  }
  function encodedProposalUrl(space: string, entityUrl: string, uuid: string) {
    return encodeURIComponent(entitylUrl(space, entityUrl, uuid));
  }

  const { share, isSupported } = useShare();

  function startShare(space: SpaceModel, entityName: string, entityUrl: string, uuid: string) {
    share({
      title: '',
      text: `${space.name} - ${entityName}`,
      url: entitylUrl(space.id, entityUrl, uuid)
    });
  }

  function shareToTwitter(space: SpaceModel, entityName: string, entityUrl: string, uuid: string, window) {
    const twitterShareUrl = `/social-share/twitter/${space.id}/guide/${uuid}?hostName=${window.location.host}`;

    const guideUrl = window.location.origin + twitterShareUrl;

    const url = `https://twitter.com/intent/tweet?text=@${space.twitter || space.name}%20${entityName}&url=${guideUrl}`;
    window.open(url, '_blank').focus();
  }

  function shareToFacebook(space: SpaceModel, entityName: string, entityUrl: string, uuid: string, window) {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodedProposalUrl(
      space.id,
      entityUrl,
      uuid
    )}&quote=${encodeURIComponent(entityName)}`;
    window.open(url, '_blank').focus();
  }

  const { copyToClipboard } = useCopy();

  function shareToClipboard(space: SpaceModel, entityUrl: string, uuid: string) {
    copyToClipboard(entitylUrl(space.id, entityUrl, uuid));
  }

  return {
    shareToTwitter,
    shareToFacebook,
    shareToClipboard,
    proposalUrl: entitylUrl,
    startShare,
    sharingIsSupported: isSupported,
    sharingItems
  };
}
