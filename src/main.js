import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import uploader from "vue-simple-uploader";

import "vue-simple-uploader/dist/style.css";
import "./assets/main.css";

const app = createApp(App);
app.use(router);
app.use(uploader);
app.mount("#app");
