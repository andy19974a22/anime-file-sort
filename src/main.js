// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/es5/util/colors'

import global from './global';

global.install = function () {
  Object.defineProperty(Vue.prototype, '$g', {
    get () {
      return global
    }
  })
};

Vue.use(global);
Vue.config.productionTip = false;
Vue.use(Vuetify,{
  theme: {
    primary: colors.orange.darken1, // #E53935
      secondary: colors.orange.lighten1, // #FFCDD2
      accent: colors.indigo.base // #3F51B5
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});


