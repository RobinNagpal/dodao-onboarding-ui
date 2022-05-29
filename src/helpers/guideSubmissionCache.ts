import { UserGuideQuestionSubmission } from '@/composables/guide/useViewGuide';

const GUIDE_SUBMISSION = 'GUIDESUBMISSION';
const ANONYMOUS = 'ANONYMOUS';
let account = ANONYMOUS;

const setAccount = (accountId: string) => {
  account = accountId;
};

interface GuideSubmissionSnapshot {
  fetchedFromServer?: boolean;
  data: Record<string, UserGuideQuestionSubmission>;
  activeStepOrder: number;
}

const saveGuideSubmission = (guideUuid: string, data: GuideSubmissionSnapshot) => {
  localStorage.setItem(`${GUIDE_SUBMISSION}_${account}_${guideUuid}`, JSON.stringify(data));
};

const readGuideSubmissionsCache = (guideUuid: string) => {
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
  localStorage.removeItem(`${GUIDE_SUBMISSION}_${account}_${guideUuid}`);
};

const setUserDiscordInSubmission = (
  guideUuid: string,
  activeStepOrder: number,
  stepUuid: string,
  userDiscordUuid: string,
  discrodInfo: string
) => {
  let guideSubmissionRef = readGuideSubmissionsCache(guideUuid);
  guideSubmissionRef = {
    ...guideSubmissionRef,
    [stepUuid]: {
      ...guideSubmissionRef[stepUuid],
      [userDiscordUuid]: discrodInfo
    }
  };
  saveGuideSubmission(guideUuid, {
    // fetchedFromServer: false,
    data: guideSubmissionRef,
    activeStepOrder
  });
};

export default {
  setAccount,
  saveGuideSubmission,
  deleteGuideSubmission,
  readGuideSubmissionsCache,
  readAllInProgressGuides,
  setUserDiscordInSubmission
};
