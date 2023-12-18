import { createRouter, createWebHistory } from "vue-router";
import GetStartedPage from "@/views/GetStartedPage.vue";
import MaintenancePage from "@/views/MaintenancePage.vue";

const routes = [
  { path: "/", name: "GetStartedPage", component: GetStartedPage },
  {
    path: "/maintenance",
    name: "MaintenancePage",
    component: MaintenancePage,
  },
];

const router = createRouter({
  history: createWebHistory('/itrf/'),
  routes,
});

export default router;
