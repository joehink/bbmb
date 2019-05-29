import axios from 'axios';

const actions = {
  login: async ({ commit }, { username, password }) => {
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
  },
  logout: ({ commit }) => {
    localStorage.removeItem('bbmb-token');
    commit('setToken', null);
  },
};

const mutations = {
  setToken: (state, token) => {
    state.authenticated = token;
  },
};

const getters = {
  isLoggedIn: state => !!state.authenticated,
};

const state = {
  authenticated: localStorage.getItem('bbmb-token'),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
