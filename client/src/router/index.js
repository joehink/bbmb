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
import Messenger from '../components/pages/Messenger';
import Conversation from '../components/messenger/Conversation';
import Conversations from '../components/messenger/Conversations';
import StartConversation from '../components/messenger/StartConversation';
import SearchPosts from '../components/pages/SearchPosts';

import store from '../store';

Vue.use(Router);

const router = new Router({
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
      props: route => ({ message: route.query.message }),
    },
    {
      path: '/posts/category/:category',
      component: CategoryPosts,
    },
    {
      path: '/posts/category/:category/create',
      component: CreatePost,
      meta: { requiresAuth: true },
    },
    {
      path: '/posts/users/:userId',
      component: UserPosts,
    },
    {
      path: '/posts/search/:searchTerm',
      component: SearchPosts,
    },
    {
      path: '/posts/:postId',
      component: PostPage,
    },
    {
      path: '/users/:userId',
      component: ProfilePage,
    },
    {
      path: '/conversations',
      component: Messenger,
      meta: { requiresAuth: true },
      children: [{
        path: '',
        component: Conversations,
      },
      {
        path: 'start',
        component: StartConversation,
      },
      {
        path: ':conversationId',
        component: Conversation,
      }],
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (!store.state.auth.authenticated) {
      next({
        path: '/auth/required',
      });
    } else {
      next();
    }
  } else {
    next();
  }
});


export default router;
