// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueLazyload from 'vue-lazyload';

import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';

// configure font awesome component
library.add(faSun);
Vue.component('font-awesome-icon', FontAwesomeIcon);

// configure lazy loader for profile picture
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/static/images/auth/error.png',
  loading: '/static/images/auth/loading.jpg',
  attempt: 1,
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
