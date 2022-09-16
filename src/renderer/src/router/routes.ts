import { RouterOptions } from "vue-router";

type PickOne<T extends Record<string, any>, K extends keyof T> = T[K];

export default [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    name: "Index",
    component: () => import("../view/index/Index.vue"),
  },
  {
    path: "/setting",
    name: "Setting",
    component: () => import("../view/setting/Setting.vue"),
  },
  {
    path: "/videodetail",
    name: "Videodetail",
    component: () => import("../view/videodetail/VideoDetail.vue"),
  },
] as PickOne<RouterOptions, "routes">;
