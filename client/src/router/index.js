import Vue from 'vue';
import Router from 'vue-router';
import Auth from '@/components/Auth';
import LogInForm from '@/components/LogInForm';
import SignUpForm from '@/components/SignUpForm';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Auth',
      component: Auth,
      children: [{
        path: '',
        component: LogInForm,
      }],
    },
    {
      path: '/signup',
      name: 'Auth',
      component: Auth,
      children: [{
        path: '',
        component: SignUpForm,
      }],
    },
  ],
});
