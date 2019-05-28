import Vue from 'vue';
import Router from 'vue-router';
import Auth from '@/components/Auth';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'LogIn',
      component: Auth,
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: Auth,
    },
  ],
});
