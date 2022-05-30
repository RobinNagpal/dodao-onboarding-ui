import { TempGuideSubmission } from '@/composables/guide/TempGuideSubmission';
import { UserDiscordInfo } from '@dodao/onboarding-schemas/models/GuideSubmissionModel';

const GUIDE_SUBMISSION = 'GUIDESUBMISSION';
const ANONYMOUS = 'ANONYMOUS';
let account = ANONYMOUS;

const setAccount = (accountId: string) => {
  account = accountId;
};

const saveGuideSubmission = (guideUuid: string, data: TempGuideSubmission) => {
  const key = `${GUIDE_SUBMISSION}_${account}_${guideUuid}`;
  localStorage.setItem(key, JSON.stringify(data));
};

const readGuideSubmissionsCache = (guideUuid: string): TempGuideSubmission => {
  return JSON.parse(localStorage.getItem(`${GUIDE_SUBMISSION}_${account}_${guideUuid}`) || '{}');
};

const readAllInProgressGuides = () => {
  const guideMap: any = {};
  for (const key in localStorage) {
    if (key.indexOf(`${GUIDE_SUBMISSION}_${account}`) > -1) {
      guideMap[key.split('_')[2]] = true;
    }
  }
  return guideMap;
};

const deleteGuideSubmission = (guideUuid: string) => {
  const key = `${GUIDE_SUBMISSION}_${account}_${guideUuid}`;
  localStorage.removeItem(key);
};

const setUserDiscordInSubmission = (
  guideUuid: string,
  activeStepOrder: number,
  stepUuid: string,
  userDiscordUuid: string,
  discordInfo: UserDiscordInfo
) => {
  let guideSubmissionRef: TempGuideSubmission = readGuideSubmissionsCache(guideUuid);
  guideSubmissionRef = {
    ...guideSubmissionRef,
    responses: {
      ...guideSubmissionRef.responses,
      [stepUuid]: {
        ...guideSubmissionRef[stepUuid],
        [userDiscordUuid]: discordInfo
      }
    }
  };
  saveGuideSubmission(guideUuid, guideSubmissionRef);
};

export default {
  setAccount,
  saveGuideSubmission,
  deleteGuideSubmission,
  readGuideSubmissionsCache,
  readAllInProgressGuides,
  setUserDiscordInSubmission
};
