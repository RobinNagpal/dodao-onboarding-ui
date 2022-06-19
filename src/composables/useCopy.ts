import { useNotifications } from '@/composables/useNotifications';
import i18n from '@/helpers/i18n';
import { useClipboard } from '@vueuse/core';

export function useCopy() {
  const { t } = i18n.global;
  const { copy, copied } = useClipboard();
  const { notify } = useNotifications();

  function copyToClipboard(text) {
    copy(text);
    if (copied) notify(t('notify.copied'));
  }

  return { copyToClipboard };
}
