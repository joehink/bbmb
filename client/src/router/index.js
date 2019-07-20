import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/pages/Home';
import Auth from '../components/auth/Auth';
import AuthRequired from '../components/pages/AuthRequired';
import LogInForm from '../components/auth/LogInForm';
import SignUpForm from '../components/auth/SignUpForm';
import CategoryPosts from '../components/pages/CategoryPosts';
import PostPage from '../components/pages/PostPage';
import ProfilePage from '../components/pages/ProfilePage';
import CreatePost from '../components/pages/CreatePost';
import UserPosts from '../components/pages/UserPosts';

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
      path: '/auth/required',
      component: AuthRequired,
    },
    {
      path: '/posts/category/:category',
      component: CategoryPosts,
    },
    {
      path: '/posts/category/:category/create',
      component: CreatePost,
    },
    {
      path: '/posts/users/:userId',
      component: UserPosts,
    },
    {
      path: '/posts/:postId',
      component: PostPage,
    },
    {
      path: '/users/:userId',
      component: ProfilePage,
    },
  ],
});
