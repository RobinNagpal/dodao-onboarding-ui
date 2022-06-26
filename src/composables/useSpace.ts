import { useWeb3 } from '@/composables/useWeb3';
import { superAdmins } from '@/helpers/auth/superAdmins';
import { getInstance } from '@/utils/auth/auth';
import { SpaceModel } from '@dodao/onboarding-schemas/models/SpaceModel';
import { computed } from 'vue';

export function useSpace(space: SpaceModel) {
  const { web3Account } = useWeb3();
  const auth = getInstance();

  const isSuperAdmin = computed(() => web3Account.value && superAdmins.includes(web3Account.value?.toLowerCase()));

  const isAdmin = computed(() => {
    const admins = space.admins?.map(address => address.toLowerCase());

    const isCreator = space?.creator && space?.creator?.toLowerCase() === web3Account?.value?.toLowerCase();

    return (
      (auth.isAuthenticated.value &&
        web3Account.value &&
        (admins?.includes(web3Account.value.toLowerCase()) || isCreator)) ||
      isSuperAdmin.value
    );
  });

  return { isAdmin, isSuperAdmin };
}
