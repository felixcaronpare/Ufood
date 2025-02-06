import { createApp } from "vue";
import { router } from "./router";
import App from "./App.vue";

import "mapbox-gl/dist/mapbox-gl.css";

import "@/style/app.css";
import "bulma/css/bulma.css";

import "@fortawesome/fontawesome-free/css/all.min.css";
import mitt from "mitt";

// Vuetify
import "vuetify/styles";
import { aliases, fa } from "vuetify/iconsets/fa";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  theme: {
    defaultTheme: "light",
  },
  components,
  directives,
  ssr: true,
  icons: {
    defaultSet: "fa",
    aliases,
    sets: {
      fa,
    },
  },
});

const app = createApp(App).use(vuetify);
const emitter = mitt();
app.provide("emitter", emitter);
app.use(router);
app.mount("#app");
