import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import StatisticsView from "@/views/StatisticsView.vue";
import ActionLogsView from "@/views/ActionLogsView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import RouletteBoardView from "@/views/RouletteBoardView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    name: "home",
    component: RouletteBoardView,
    children: [
      {
        path: "/home/logs",
        component: ActionLogsView,
      },
    ],
  },
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/statistics",
    name: "statistics",
    component: StatisticsView,
  },
  {
    path: "/:catchall(.*)*",
    name: "404",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
