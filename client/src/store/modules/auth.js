import axios from 'axios';

const actions = {
  login: async ({ commit }) => {
    const res = await axios({
      method: 'POST',
      url: '/api/sessions',
      data: {
        username: '',
        password: '',
      },
    });

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
    localStorage.setItem('bbmb-token', token);
  },
};

const getters = {
  isLoggedIn: state => !!state.authenticated,
};

const state = {
  authenticated: null,
};

export default {
  state,
  getters,
  actions,
  mutations,
};
