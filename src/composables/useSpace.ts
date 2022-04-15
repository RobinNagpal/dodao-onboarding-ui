import { useWeb3 } from '@/composables/useWeb3';
import { getInstance } from '@/utils/auth/auth';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed } from 'vue';

export function useSpace(space: SpaceModel) {
  const { web3Account } = useWeb3();
  const auth = getInstance();

  const isSuperAdmin = computed(
    () =>
      web3Account.value?.toLowerCase() ===
      '0x470579d16401a36bf63b1428eaa7189fbde5fee9'
  );

  const isAdmin = computed(() => {
    const admins = space.admins?.map(address => address.toLowerCase());

    const isCreator =
      space?.creator &&
      space?.creator?.toLowerCase() === web3Account?.value?.toLowerCase();

    return (
      (auth.isAuthenticated.value &&
        web3Account.value &&
        (admins?.includes(web3Account.value.toLowerCase()) || isCreator)) ||
      isSuperAdmin.value
    );
  });

  return { isAdmin, isSuperAdmin };
}
