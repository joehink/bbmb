import axios from 'axios';

const actions = {
  login: async ({ commit }, { username, password }) => {
    try {
      if (!username || !password) {
        commit('setError', 'Must provide username and password.');
      } else if (username.length > 25) {
        commit('setError', 'Username must be 25 characters or less.');
      } else {
        commit('setAuthLoading', true);
        const res = await axios({
          method: 'POST',
          url: '/api/sessions',
          data: {
            username,
            password,
          },
        });
        localStorage.setItem('bbmb-token', res.data.token);
        commit('setToken', res.data.token);
        commit('setAuthLoading', false);
      }
    } catch (err) {
      if (err.response.status === 401) {
        commit('setError', 'Invalid log in credentials.');
      } else {
        commit('setError', 'Something went wrong while logging in.');
      }
      commit('setAuthLoading', false);
    }
  },
  logout: ({ commit }) => {
    localStorage.removeItem('bbmb-token');
    commit('setToken', null);
  },
  signup: async ({ commit }, { username, password, confirmPassword }) => {
    try {
      if (!username || !password) {
        commit('setError', 'Must provide username and password.');
      } else if (username.length > 25) {
        commit('setError', 'Username must be 25 characters or less.');
      } else if (password !== confirmPassword) {
        commit('setError', 'Password does not match confirmation.');
      } else {
        commit('setAuthLoading', true);
        const res = await axios({
          method: 'POST',
          url: '/api/users',
          data: {
            username,
            password,
          },
        });
        localStorage.setItem('bbmb-token', res.data.token);
        commit('setToken', res.data.token);
        commit('setAuthLoading', false);
      }
    } catch (err) {
      commit('setError', err.response.data.message);
      commit('setAuthLoading', false);
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
};

const getters = {
  isLoggedIn: state => !!state.authenticated,
  user: state => state.user,
  isAuthLoading: state => state.isLoading,
};

const state = {
  authenticated: localStorage.getItem('bbmb-token'),
  user: null,
  isLoading: false,
};

export default {
  state,
  getters,
  actions,
  mutations,
};
