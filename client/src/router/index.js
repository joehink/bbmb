import Vue from 'vue';
import Router from 'vue-router';
import MainNav from '@/components/MainNav';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainNav',
      component: MainNav,
    },
  ],
});
