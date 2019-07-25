import axios from 'axios';

const actions = {
  getConversations: async ({ commit, rootState }) => {
    const res = await axios({
      method: 'GET',
      url: '/api/conversations',
      headers: {
        authorization: rootState.auth.authenticated,
      },
    });

    commit('setConversations', res.data);
  },
};

const mutations = {
  setConversations: (state, conversations) => {
    state.conversations = conversations;
  },
};

const getters = {
  conversations: state => state.conversations,
};

const state = {
  conversations: null,
};

export default {
  state,
  getters,
  actions,
  mutations,
};
