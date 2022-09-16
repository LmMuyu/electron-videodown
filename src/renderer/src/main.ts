import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import elicon from "./plugins/elicon";
import { createPinia } from "pinia";

import "./assets/css/normalize.css";
import "element-plus/theme-chalk/index.css";
import "tailwindcss/tailwind.css";

const app = createApp(App);

app.use(elicon);
app.use(router);
app.use(createPinia());
app.mount("#app");
