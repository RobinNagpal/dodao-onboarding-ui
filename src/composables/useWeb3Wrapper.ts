import { useClient } from '@/composables/useClient';
import { useWeb3 } from '@/composables/useWeb3';
import { AuthConnector } from '@/utils/auth/authConnector';
import { getValidDecodedToken } from '@/utils/auth/jwtUtil';

export function useWeb3Wrapper() {
  const { login, logout, web3Account } = useWeb3();
  const { sendLogin } = useClient();

  async function loginWrapper(connector: AuthConnector) {
    await login(connector);
    let isValidJWT = false;
    const validDecodedToken = getValidDecodedToken();
    if (validDecodedToken) {
      const isSameAccount = validDecodedToken.accountId === web3Account.value;
      if (isSameAccount) {
        isValidJWT = true;
      }
    }
    if (!isValidJWT) {
      const response = await sendLogin(connector);
      const jwt = response?.jwt;
      if (jwt) {
        localStorage.setItem(`dodao_token`, jwt);
      }
    }
  }

  async function logoutWrapper() {
    localStorage.removeItem(`dodao_token`);
    logout();
  }

  return {
    loginWrapper,
    logoutWrapper
  };
}
