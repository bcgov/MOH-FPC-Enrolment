import { APP_ROUTES } from '../app.constants';

/** Name of each page */
const PAGE_NAMES = {
  home: 'get-started',
  personalInfo: 'personal-info',
  calcIncome: 'calculate-income',
  review: 'review',
  consent: 'declaration',
  confirmation: 'confirmation',
};

/** Page route information */
export const INCOME_REVIEW_PAGES = {
  HOME: {
    path: PAGE_NAMES.home,
    fullpath: `${APP_ROUTES.income_review}/${PAGE_NAMES.home}`,
    title: PAGE_NAMES.home,
  },
  PERSONAL_INFO: {
    path: PAGE_NAMES.personalInfo,
    fullpath: `${APP_ROUTES.income_review}/${PAGE_NAMES.personalInfo}`,
    title: PAGE_NAMES.personalInfo,
  },
  INCOME: {
    path: PAGE_NAMES.calcIncome,
    fullpath: `${APP_ROUTES.income_review}/${PAGE_NAMES.calcIncome}`,
    title: PAGE_NAMES.calcIncome,
  },
  REVIEW: {
    path: PAGE_NAMES.review,
    fullpath: `${APP_ROUTES.income_review}/${PAGE_NAMES.review}`,
    title: PAGE_NAMES.review,
  },
  CONSENT: {
    path: PAGE_NAMES.consent,
    fullpath: `${APP_ROUTES.income_review}/${PAGE_NAMES.consent}`,
    title: PAGE_NAMES.consent,
  },
  CONFIRMATION: {
    path: PAGE_NAMES.confirmation,
    fullpath: `${APP_ROUTES.income_review}/${PAGE_NAMES.confirmation}`,
    title: PAGE_NAMES.confirmation,
  },
};

export const FORM_SUBMIT_LABEL = 'Submit';
export const SUCCESSFUL_CONFIRMATION_MSG =
  'Your application has been submitted.';
export const ERROR_CONFIRMATION_MSG = 'Submission of your application failed.';
