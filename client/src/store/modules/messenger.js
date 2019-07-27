import axios from 'axios';
import router from '../../router';

const actions = {
  getConversations: async ({ commit, rootState }) => {
    if (rootState.auth.authenticated) {
      const res = await axios({
        method: 'GET',
        url: '/api/conversations',
        headers: {
          authorization: rootState.auth.authenticated,
        },
      });
      commit('setConversations', res.data);
    }
  },
  getConversation: async ({ commit, rootState }, conversationId) => {
    commit('resetActiveConversation');
    const res = await axios({
      method: 'GET',
      url: `/api/conversations/${conversationId}`,
      headers: {
        authorization: rootState.auth.authenticated,
      },
    });

    const conversation = {
      id: res.data.conversation._id,
      messages: res.data.messages,
      participants: res.data.conversation.participants,
      unread: res.data.conversation.unread,
    };

    commit('setActiveConversation', conversation);
  },
  findOrStartConversation({ state }, { to }) {
    if (!state.conversations) {
      return router.push('/conversations/new');
    }

    const foundConversation = state.conversations.find((conversation) => {
      const containsUser = conversation
        .participants
        .some(participant => participant._id === to._id);
      return containsUser;
    });

    if (!foundConversation) {
      return router.push('/conversations/new');
    }

    return router.push(`/conversations/${foundConversation._id}`);
  },
};

const mutations = {
  setConversations: (state, conversations) => {
    state.conversations = conversations;
  },
  setActiveConversation: (state, conversation) => {
    state.activeConversation = conversation;
  },
  resetActiveConversation: (state) => {
    state.activeConversation = {
      id: '',
      messages: [],
      participants: [],
      unread: [],
    };
  },
};

const getters = {
  conversations: state => state.conversations,
  activeConversation: state => state.activeConversation,
};

const state = {
  conversations: null,
  activeConversation: {
    id: '',
    messages: [],
    participants: [],
    unread: [],
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
