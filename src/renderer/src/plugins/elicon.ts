import { App } from "vue";
import * as ElementPlusIconVue from "@element-plus/icons-vue";

export default {
  install(app: App) {
    const include = ["Loading"];

    for (const [compname, component] of Object.entries(ElementPlusIconVue)) {
      if (include.indexOf(compname) > -1) {
        app.component(compname, component);
      }
    }
  },
};
