import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/pages/Home';
import Auth from '../components/auth/Auth';
import LogInForm from '../components/auth/LogInForm';
import SignUpForm from '../components/auth/SignUpForm';
import CategoryPosts from '../components/pages/CategoryPosts';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/login',
      component: Auth,
      children: [{
        path: '',
        component: LogInForm,
      }],
    },
    {
      path: '/signup',
      component: Auth,
      children: [{
        path: '',
        component: SignUpForm,
      }],
    },
    {
      path: '/posts/category/:category',
      component: CategoryPosts,
    },
  ],
});
