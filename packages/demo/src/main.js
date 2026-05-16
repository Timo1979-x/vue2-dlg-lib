import Vue from "vue";
import VueDialogLibrary from "vue2-dlg-lib";
import App from "./App.vue";

Vue.use(VueDialogLibrary);

new Vue({
  render: (h) => h(App),
}).$mount("#app");
