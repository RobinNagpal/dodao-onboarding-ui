import i18n, {
  defaultLocale,
  loadLocaleMessages,
  setI18nLanguage
} from '@/helpers/i18n';
import { lsGet, lsSet } from '@/helpers/utils';
import { ref } from 'vue';

const currentLocale = ref(lsGet('locale', defaultLocale));

export function useI18n() {
  async function setLocale(locale) {
    currentLocale.value = locale;
    lsSet('locale', locale);
    await loadLocaleMessages(i18n, locale);
    setI18nLanguage(i18n, locale);
  }

  async function loadLocale() {
    await loadLocaleMessages(i18n, currentLocale.value);
    setI18nLanguage(i18n, currentLocale.value);
  }

  return { setLocale, loadLocale, currentLocale: currentLocale.value };
}
