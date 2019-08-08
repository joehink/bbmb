import axios from 'axios';
import Vue from 'vue';
import router from '../../router';

const actions = {
  login: async ({ commit, dispatch }, { username, password }) => {
    try {
      if (!username || !password) {
        // if no username or password provided
        commit('setError', 'Must provide username and password.');
      } else if (username.length > 25) {
        // if username is longer than 25 characters
        commit('setError', 'Username must be 25 characters or less.');
      } else {
        commit('setAuthLoading', true);
        // try to log the user in
        const res = await axios({
          method: 'POST',
          url: '/api/sessions',
          data: {
            username,
            password,
          },
        });
        // save auth token in local storage
        localStorage.setItem('bbmb-token', res.data.token);
        // store auth token in vuex state
        commit('setToken', res.data.token);
        // store logged in user in vuex state
        commit('setUser', res.data.user);
        (new Vue()).$socket.emit('login', res.data.user._id);
        commit('setAuthLoading', false);

        dispatch('getConversations');
        // navigate to home page
        router.push('/');
      }
    } catch (err) {
      if (err.response.status === 401) {
        // if auth error is returned
        commit('setError', 'Invalid log in credentials.');
      } else {
        // if some other error is returned
        commit('setError', 'Something went wrong while logging in.');
      }
      commit('setAuthLoading', false);
    }
  },
  logout: ({ commit }) => {
    // remove auth token from local storage
    localStorage.removeItem('bbmb-token');
    window.location.reload(true);

    // remove auth token from vuex state
    commit('setToken', null);
    // remove user object from vuex state
    commit('setUser', null);
  },
  signup: async ({ commit }, { username, password, confirmPassword }) => {
    try {
      if (!username || !password) {
        // if no username or password provided
        commit('setError', 'Must provide username and password.');
      } else if (username.length > 15) {
        // if username is longer than 20 characters
        commit('setError', 'Username must be 15 characters or less.');
      } else if (password !== confirmPassword) {
        // if password does not match password confirmation
        commit('setError', 'Password does not match confirmation.');
      } else {
        commit('setAuthLoading', true);
        // try to create a new user account
        const res = await axios({
          method: 'POST',
          url: '/api/users',
          data: {
            username,
            password,
          },
        });
        // save auth token in local storage
        localStorage.setItem('bbmb-token', res.data.token);
        // store auth token in vuex state
        commit('setToken', res.data.token);
        // store logged in user in vuex state
        commit('setUser', res.data.user);
        commit('setAuthLoading', false);
        // navigate to home page
        router.push('/');
      }
    } catch (err) {
      commit('setError', err.response.data.message);
      commit('setAuthLoading', false);
    }
  },
  getCurrentUser: async ({ commit, state }) => {
    try {
      // if user is logged in
      if (state.authenticated) {
        // fetch logged in user object
        const res = await axios({
          method: 'GET',
          url: '/api/users',
          headers: {
            authorization: state.authenticated,
          },
        });
        // store user in vuex state
        commit('setUser', res.data.user);
        (new Vue()).$socket.emit('login', res.data.user._id);
      }
    } catch (err) {
      commit('setUser', null);
    }
  },
  deleteAccount: async ({ commit, state, dispatch }, userId) => {
    try {
      if (!state.isDeletingAccount) {
        commit('setDeletingAccount', true);
        commit('setDisableModal', true);
        await axios({
          method: 'DELETE',
          url: `/api/users/${userId}`,
          headers: {
            authorization: state.authenticated,
          },
        });
        router.push('/');
        commit('setDeletingAccount', false);
        commit('setDisableModal', false);
        dispatch('logout');
      }
    } catch (err) {
      commit('setDeletingAccount', false);
      commit('setDisableModal', false);
    }
  },
};

const mutations = {
  setToken: (state, token) => {
    state.authenticated = token;
  },
  setUser: (state, user) => {
    state.user = user;
  },
  setAuthLoading: (state, isLoading) => {
    state.isLoading = isLoading;
  },
  setDeletingAccount: (state, isDeleting) => {
    state.isDeleting = isDeleting;
  },
};

const getters = {
  isLoggedIn: state => !!state.authenticated,
  user: state => state.user,
  isAuthLoading: state => state.isLoading,
  token: state => state.authenticated,
  isDeletingAccount: state => state.isDeleting,
};

const state = {
  authenticated: localStorage.getItem('bbmb-token'),
  user: null,
  isLoading: false,
  isDeleting: false,
};

export default {
  state,
  getters,
  actions,
  mutations,
};
