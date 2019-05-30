const actions = {};

const mutations = {
  setError: (state, error) => {
    state.error = error;
  },
};

const getters = {
  error: state => state.error,
};

const state = {
  error: '',
};

export default {
  state,
  getters,
  actions,
  mutations,
};
