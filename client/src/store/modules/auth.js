import axios from 'axios';

const actions = {
  login: async ({ commit }, { username, password }) => {
    try {
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
    } catch (err) {
      if (err.response.status === 401) {
        commit('setError', 'Invalid log in credentials.');
      } else {
        commit('setError', 'Something went wrong while logging in.');
      }
    }
  },
  logout: ({ commit }) => {
    localStorage.removeItem('bbmb-token');
    commit('setToken', null);
  },
  signup: async ({ commit }, { username, password, confirmPassword }) => {
    try {
      if (password === confirmPassword) {
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
      } else {
        commit('setError', 'Password does not match confirmation.');
      }
    } catch (err) {
      commit('setError', err.response.data.message);
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
};

const getters = {
  isLoggedIn: state => !!state.authenticated,
  user: state => state.user,
};

const state = {
  authenticated: localStorage.getItem('bbmb-token'),
  user: null,
};

export default {
  state,
  getters,
  actions,
  mutations,
};
