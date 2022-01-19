import { useNotifications } from '@/composables/useNotifications';
import { useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

export function useCopy() {
  const { t } = useI18n();
  const { copy, copied } = useClipboard();
  const { notify } = useNotifications();

  function copyToClipboard(text) {
    copy(text);
    if (copied) notify(t('notify.copied'));
  }

  return { copyToClipboard };
}
