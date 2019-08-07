import axios from 'axios';
import Vue from 'vue';
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

    const conversationIndex = state
      .conversations
      .findIndex(convo => convo._id === conversation._id);
    commit('updateConversationAtIndex', { conversationIndex, conversation });

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
  findOrStartConversation: ({ state, rootState, commit }, { to }) => {
    if (!state.conversations) {
      return router.push('/conversations/start');
    }

    const foundConversation = state.conversations.find((conversation) => {
      const containsUser = conversation
        .participants
        .some(participant => participant._id === to._id);
      return containsUser;
    });

    if (!foundConversation) {
      const activeConversation = {
        id: true,
        messages: [],
        participants: [rootState.auth.user, to],
        unread: [to._id],
        message: state.activeConversation.message,
      };
      commit('setActiveConversation', activeConversation);
      return router.push('/conversations/start');
    }

    return router.push(`/conversations/${foundConversation._id}`);
  },
  sendMessage: async ({ state, commit, rootState }) => {
    try {
      commit('setSendingMessage', true);
      if (state.activeConversation.message) {
        const res = await axios({
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
        const conversationIndex = state
          .conversations
          .findIndex(convo => convo._id === res.data.conversation._id);
        commit('updateConversationAtIndex', { conversationIndex, conversation: res.data.conversation });
        commit('addToMessages', res.data.message);
        commit('setMessage', '');
        commit('setSendingMessage', false);
        (new Vue()).$socket.emit('SEND_MESSAGE', res.data);
      }
    } catch (err) {
      commit('setSendingMessage', false);
    }
  },
  createConversation: async ({ state, commit, rootState }) => {
    try {
      commit('setSendingMessage', true);
      if (state.activeConversation.message) {
        const res = await axios({
          method: 'POST',
          url: '/api/conversations',
          headers: {
            authorization: rootState.auth.authenticated,
          },
          data: {
            body: state.activeConversation.message,
            unread: state.activeConversation.unread,
            participants: state.activeConversation.participants,
          },
        });
        (new Vue()).$socket.emit('NEW_CONVERSATION', res.data.conversation);
        commit('addToConversations', res.data.conversation);
        router.push(`/conversations/${res.data.conversation._id}`);
        commit('setMessage', '');
        commit('setSendingMessage', false);
      }
    } catch (err) {
      commit('setSendingMessage', false);
    }
  },
  markAsRead: async ({ state, rootState, commit }, conversationId) => {
    const res = await axios({
      method: 'PATCH',
      url: `/api/conversations/${conversationId}`,
      headers: {
        authorization: rootState.auth.authenticated,
      },
    });

    const conversationIndex = state
      .conversations
      .findIndex(convo => convo._id === res.data._id);
    commit('updateConversationAtIndex', { conversationIndex, conversation: res.data });
  },
  SOCKET_DELIVER_MESSAGE: ({ state, commit, dispatch }, { conversation, message }) => {
    if (state.activeConversation.id === conversation._id) {
      commit('addToMessages', message);
      dispatch('markAsRead', conversation._id);
    }

    const conversationIndex = state
      .conversations
      .findIndex(convo => convo._id === conversation._id);
    commit('updateConversationAtIndex', { conversationIndex, conversation });
  },
  SOCKET_ADD_CONVERSATION: ({ commit }, conversation) => {
    commit('addToConversations', conversation);
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
  addToMessages: (state, message) => {
    state.activeConversation.messages = [...state.activeConversation.messages, message];
  },
  addToConversations: (state, conversation) => {
    state.conversations = [conversation, ...state.conversations];
  },
  updateConversationAtIndex: (state, { conversationIndex, conversation }) => {
    state.conversations.splice(conversationIndex, 1, conversation);
  },
};

const getters = {
  conversations: state => state.conversations,
  activeConversation: state => state.activeConversation,
  isSendingMessage: state => state.status.sendingMessage,
  hasUnreadMessages(state, otherGetters, rootState) {
    if (state.conversations) {
      return state.conversations.some(convo => convo.unread.includes(rootState.auth.user._id));
    }
    return false;
  },
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
