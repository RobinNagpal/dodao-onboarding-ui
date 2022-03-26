import { JwtModel } from '@dodao/onboarding-schemas/models/JwtModel';
import jwt_decode from 'jwt-decode';

export function getValidDecodedToken(): JwtModel | null {
  const exitingJwt = localStorage.getItem(`dodao_token`);

  const jwtModel = exitingJwt ? jwt_decode<JwtModel>(exitingJwt) : null;

  const isNotExpired =
    jwtModel?.exp && jwtModel.exp - Date.now() / 1000 > 2 * 24 * 60 * 60;

  return isNotExpired ? jwtModel : null;
}

export function getJwt() {
  return localStorage.getItem(`dodao_token`);
}
