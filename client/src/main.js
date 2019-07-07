// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faSun,
  faBold,
  faItalic,
  faStrikethrough,
  faUnderline,
  faParagraph,
  faListUl,
  faListOl,
  faQuoteRight,
  faGripHorizontal,
  faUndo,
  faRedo,
  faComment,
  faReply,
  faEdit,
  faTrashAlt,
  faEllipsisV,
  faSort,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueLazyload from 'vue-lazyload';

import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';

// configure font awesome component
library.add(
  faSun,
  faBold,
  faItalic,
  faStrikethrough,
  faUnderline,
  faParagraph,
  faListUl,
  faListOl,
  faQuoteRight,
  faGripHorizontal,
  faUndo,
  faRedo,
  faComment,
  faReply,
  faEdit,
  faTrashAlt,
  faEllipsisV,
  faSort,
);
Vue.component('font-awesome-icon', FontAwesomeIcon);

// configure lazy loader for profile picture
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/static/images/auth/error.png',
  loading: '/static/images/auth/loading.gif',
  attempt: 1,
});

// This variable will hold the reference to
// document's click handler
let handleOutsideClick;
Vue.directive('closable', {
  bind(el, binding, vnode) {
    // Here's the click/touchstart handler
    // (it is registered below)
    handleOutsideClick = (e) => {
      e.stopPropagation();
      // Get the handler method name and the exclude array
      // from the object used in v-closable
      const { handler, exclude } = binding.value;
      // This variable indicates if the clicked element is excluded
      let clickedOnExcludedEl = false;
      exclude.forEach((refName) => {
        // We only run this code if we haven't detected
        // any excluded element yet
        if (!clickedOnExcludedEl) {
          // Get the element using the reference name
          const excludedEl = vnode.context.$refs[refName];
          // See if this excluded element
          // is the same element the user just clicked on
          clickedOnExcludedEl = excludedEl.contains(e.target);
        }
      });
      // We check to see if the clicked element is not
      // the dialog element and not excluded
      if (!el.contains(e.target) && !clickedOnExcludedEl) {
        // If the clicked element is outside the dialog
        // and not the button, then call the outside-click handler
        // from the same component this directive is used in
        vnode.context[handler]();
      }
    };
    // Register click/touchstart event listeners on the whole page
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
  },
  unbind() {
    // If the element that has v-closable is removed, then
    // unbind click/touchstart listeners from the whole page
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('touchstart', handleOutsideClick);
  },
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
