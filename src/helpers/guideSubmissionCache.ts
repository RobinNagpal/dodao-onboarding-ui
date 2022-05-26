import { UserGuideQuestionSubmission } from '@/composables/guide/useViewGuide';

const GUIDE_SUBMISSION = 'GUIDE_SUBMISSION';
const ANONYMOUS = 'ANONYMOUS';
let account = ANONYMOUS;

const setAccount = (accountId: string) => {
  account = accountId;
};

interface GuideSubmissionSnapshot {
  fetchedFromServer?: boolean;
  data: Record<string, UserGuideQuestionSubmission>;
}

const saveGuideSubmission = (
  guideUuid: string,
  data: GuideSubmissionSnapshot
) => {
  localStorage.setItem(
    `${GUIDE_SUBMISSION}_${account}_${guideUuid}`,
    JSON.stringify(data)
  );
};

const readGuideSubmissionsCache = (guideUuid: string) => {
  const result = JSON.parse(
    localStorage.getItem(`${GUIDE_SUBMISSION}_${account}_${guideUuid}`) || '{}'
  );

  return result;
};

export default { setAccount, saveGuideSubmission, readGuideSubmissionsCache };
