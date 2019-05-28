import Vue from 'vue';
import Router from 'vue-router';
import Auth from '@/components/Auth';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Auth',
      component: Auth,
    },
    {
      path: '/signup',
      name: 'Auth',
      component: Auth,
    },
  ],
});
