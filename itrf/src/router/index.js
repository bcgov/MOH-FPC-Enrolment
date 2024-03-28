import { createRouter, createWebHistory } from "vue-router";
import GetStartedPage from "../views/GetStartedPage.vue";
import PersonalInfoPage from "../views/PersonalInfoPage.vue";
import SubmissionPage from "../views/SubmissionPage.vue";
import SubmissionErrorPage from "../views/SubmissionErrorPage.vue";
import MaintenancePage from "../views/MaintenancePage.vue";
import pageStateService from "../services/page-state-service";

export const routes = {
  GET_STARTED: {
    path: "/",
    title: "Get Started",
    name: "GetStarted",
    component: GetStartedPage,
  },
  PERSONAL_INFO: {
    path: "/personal-info",
    title: "Personal Information",
    name: "PersonalInfo",
    component: PersonalInfoPage,
  },
  SUBMISSION: {
    path: "/submission",
    title: "Submission",
    name: "Submission",
    component: SubmissionPage,
  },
  SUBMISSION_ERROR: {
    path: "/submission-error",
    title: "Submission Error",
    name: "SubmissionError",
    component: SubmissionErrorPage,
  },
  MAINTENANCE: {
    path: "/maintenance",
    title: "Maintenance",
    name: "Maintenance",
    component: MaintenancePage,
  },
};

export const stepRoutes = [
  { ...routes.GET_STARTED },
  { ...routes.PERSONAL_INFO },
  { ...routes.SUBMISSION },
];

export const routeStepOrder = [
  routes.GET_STARTED,
  routes.PERSONAL_INFO,
  routes.SUBMISSION,
];

const router = createRouter({
  history: createWebHistory("/itrf/"),
  routes: [
    {
      path: routes.GET_STARTED.path,
      name: routes.GET_STARTED.name,
      component: routes.GET_STARTED.component,
    },
    {
      path: routes.PERSONAL_INFO.path,
      name: routes.PERSONAL_INFO.name,
      component: routes.PERSONAL_INFO.component,
    },
    {
      path: routes.SUBMISSION.path,
      name: routes.SUBMISSION.name,
      component: routes.SUBMISSION.component,
    },
    {
      path: routes.MAINTENANCE.path,
      name: routes.MAINTENANCE.name,
      component: routes.MAINTENANCE.component,
    },
  ],
});

export const isPastPath = (toPath, fromPath) => {
  for (let i = 0; i < routeStepOrder.length; i++) {
    if (routeStepOrder[i].path === fromPath) {
      return false;
    } else if (routeStepOrder[i].path === toPath) {
      return true;
    }
  }
  return false;
};

pageStateService.importPageRoutes(routes);

router.beforeEach((to, from, next) => {
  // Home redirects.
  if (
    to.path !== routes.GET_STARTED.path &&
    !pageStateService.isPageVisited(to.path)
  ) {
    next({ path: routes.GET_STARTED.path });
  } else {
    // Catch-all (navigation).
    next();
  }
});

export default router;
