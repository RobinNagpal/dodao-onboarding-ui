import { useClient } from '@/composables/useClient';
import { useWeb3 } from '@/composables/useWeb3';
import { AuthConnector } from '@/utils/auth/authConnector';
import { JwtModel } from '@dodao/onboarding-schemas/models/JwtModel';
import jwt_decode from 'jwt-decode';

export function useWeb3Wrapper() {
  const { login, logout, web3Account } = useWeb3();
  const { sendLogin } = useClient();

  async function loginWrapper(connector: AuthConnector) {
    await login(connector);
    const exitingJwt = localStorage.getItem(`dodao_token`);
    let isValidJWT = false;

    if (exitingJwt) {
      const jwtModel = jwt_decode<JwtModel>(exitingJwt);
      const isSameAccount = jwtModel.accountId === web3Account.value;
      const isNotExpired = jwtModel.exp - Date.now() / 1000 > 2 * 24 * 60 * 60;
      if (isSameAccount && isNotExpired) {
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
