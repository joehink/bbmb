import Vuex from 'vuex';
import Vue from 'vue';

import auth from './modules/auth';
import error from './modules/error';
import posts from './modules/posts';
import post from './modules/post';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    error,
    post,
    posts,
  },
});
