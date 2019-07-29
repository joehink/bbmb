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
  getConversation: async ({ commit, rootState, state }, conversationId) => {
    commit('resetActiveConversation');
    const res = await axios({
      method: 'GET',
      url: `/api/conversations/${conversationId}`,
      headers: {
        authorization: rootState.auth.authenticated,
      },
    });

    const { conversation, messages } = res.data;

    const unread = conversation
      .participants
      .filter(participant => participant._id !== rootState.auth.user._id);

    const activeConversation = {
      id: conversation._id,
      messages,
      participants: conversation.participants,
      unread,
      message: state.activeConversation.message,
    };

    commit('setActiveConversation', activeConversation);
  },
  findOrStartConversation: ({ state }, { to }) => {
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
  sendMessage: async ({ state, commit, rootState }) => {
    try {
      commit('setSendingMessage', true);
      if (state.activeConversation.message) {
        await axios({
          method: 'POST',
          url: `/api/conversations/${state.activeConversation.id}`,
          headers: {
            authorization: rootState.auth.authenticated,
          },
          data: {
            body: state.activeConversation.message,
            unread: state.activeConversation.unread,
          },
        });
        commit('setMessage', '');
        commit('setSendingMessage', false);
      }
    } catch (err) {
      commit('setSendingMessage', false);
    }
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
      message: state.activeConversation.message,
    };
  },
  setMessage: (state, message) => {
    state.activeConversation.message = message;
  },
  setSendingMessage: (state, isSendingMessage) => {
    state.status.sendingMessage = isSendingMessage;
  },
};

const getters = {
  conversations: state => state.conversations,
  activeConversation: state => state.activeConversation,
  isSendingMessage: state => state.status.sendingMessage,
};

const state = {
  conversations: null,
  activeConversation: {
    id: '',
    messages: [],
    participants: [],
    unread: [],
    message: '',
  },
  status: {
    sendingMessage: false,
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
