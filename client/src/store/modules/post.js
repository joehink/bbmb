import axios from 'axios';
import router from '../../router';

const actions = {
  getPost: async ({ commit }, postId) => {
    try {
      commit('setPostLoading', true);
      // Fetch post
      const res = await axios({
        method: 'GET',
        url: `/api/posts/${postId}`,
      });

      commit('setPostFormTitle', res.data.title);
      commit('setPostFormBody', res.data.body);
      commit('setPost', res.data);
      commit('setPostLoading', false);
    } catch (err) {
      commit('setPostLoading', false);
    }
  },
  getPostComments: async ({ commit }, postId) => {
    try {
      commit('setCommentsLoading', true);
      // fetch post comments
      const res = await axios({
        method: 'GET',
        url: `/api/posts/${postId}/comments`,
      });

      // add new comments to existing comments array
      commit('addToCommentsList', res.data.comments);
      commit('setCommentsLoading', false);
    } catch (err) {
      commit('setCommentsLoading', false);
    }
  },
  createPost: async ({ commit, state, rootState }, category) => {
    try {
      const { content, title } = state.form;
      if (!content || !title) {
        commit('setError', 'Must provide a title and a body.');
      } else {
        commit('setPostSaving', true);
        const res = await axios({
          method: 'POST',
          url: '/api/posts',
          headers: {
            authorization: rootState.auth.authenticated,
          },
          data: {
            title,
            body: content,
            category,
          },
        });
        router.push(`/posts/${res.data._id}`);
      }
      commit('setPostSaving', false);
      commit('setPostFormTitle', '');
      commit('setPostFormBody', '');
    } catch (err) {
      commit('setError', err.response.data.message);
      commit('setPostSaving', false);
    }
  },
  updatePost: async ({ commit, state, rootState }) => {
    try {
      const { content, title } = state.form;
      if (!content || !title) {
        commit('setError', 'Must provide a title and a body.');
      } else {
        commit('setPostSaving', true);
        // update post with new title and body
        const res = await axios({
          method: 'PATCH',
          url: `/api/posts/${state.data._id}`,
          headers: {
            authorization: rootState.auth.authenticated,
          },
          data: {
            title,
            body: content,
          },
        });

        // emit event to update post in PostPage Component
        commit('setPost', res.data);
        commit('setPostSaved', true);
        commit('setPostEditable', false);
        commit('setPostSaving', false);
      }
    } catch (err) {
      commit('setError', err.response.data.message);
      commit('setPostSaving', false);
    }
  },
  likePost: async ({ commit, state, rootState }) => {
    try {
      const { liking } = state.status;
      // if like request is not being made and user is logged in
      if (!liking && !!rootState.auth.authenticated) {
        commit('setPostLiking', true);
        // Make request to like or unlike post
        const res = await axios({
          method: 'PATCH',
          url: `/api/posts/${state.data._id}/like`,
          headers: {
            authorization: rootState.auth.authenticated,
          },
        });
        commit('setPost', res.data);
        commit('setPostLiking', false);
      }
    } catch (err) {
      commit('setPostLiking', false);
    }
  },
  resetPost: ({ commit }) => {
    commit('setPostLoading', false);
    commit('setPostFormTitle', '');
    commit('setPostFormBody', '');
    commit('setPost', false);
    commit('setPostLiking', false);
    commit('setPostSaving', false);
    commit('setPostSaved', false);
    commit('setPostEditable', false);
    commit('setCommentsLoading', false);
    commit('clearCommentsList');
    commit('setCreatingComment', false);
    commit('setCommentFormBody', '');
    commit('setCommentSaved', false);
    commit('setSavingComment', false);
  },
  createComment: async ({ commit, state, rootState }) => {
    try {
      if (!state.comments.form.body) {
        commit('setError', 'Must provide a body.');
      } else if (rootState.auth.authenticated) {
        commit('setSavingComment', true);
        const res = await axios({
          method: 'POST',
          url: `/api/posts/${state.data._id}/comments`,
          data: {
            body: state.comments.form.body,
          },
          headers: {
            authorization: rootState.auth.authenticated,
          },
        });
        commit('addToCommentsList', [res.data]);
        commit('setCommentFormBody', '');
        commit('toggleCreatingComment');
        commit('setCommentSaved', true);
        commit('setSavingComment', false);
      }
    } catch (err) {
      commit('setSavingComment', false);
      commit('setError', err.response.data.message);
    }
  },
};

const mutations = {
  setPost: (state, updatedPost) => {
    state.data = updatedPost;
  },
  setPostLoading: (state, isLoading) => {
    state.status.loading = isLoading;
  },
  setPostSaving: (state, isSaving) => {
    state.status.saving = isSaving;
  },
  setPostSaved: (state, isSaved) => {
    state.status.saved = isSaved;
  },
  setPostContentChanged: (state, isChanged) => {
    state.status.contentChanged = isChanged;
  },
  setPostEditable: (state, isEditable) => {
    state.status.editable = isEditable;
  },
  setPostLiking: (state, isLiking) => {
    state.status.liking = isLiking;
  },
  setPostFormTitle: (state, text) => {
    state.form.title = text;
  },
  setPostFormBody: (state, text) => {
    state.form.content = text;
  },
  setCommentsLoading: (state, isLoading) => {
    state.comments.loading = isLoading;
  },
  addToCommentsList: (state, newComments) => {
    state.comments.list = [...state.comments.list, ...newComments];
  },
  clearCommentsList: (state) => {
    state.comments.list = [];
  },
  toggleCreatingComment: (state) => {
    state.comments.status.creating = !state.comments.status.creating;
  },
  setCreatingComment: (state, isCreating) => {
    state.comments.status.creating = isCreating;
  },
  setCommentFormBody: (state, text) => {
    state.comments.form.body = text;
  },
  setCommentSaved: (state, isSaved) => {
    state.comments.status.saved = isSaved;
  },
  setCommentLiking: (state, isLiking) => {
    state.comments.status.liking = isLiking;
  },
  setSavingComment: (state, isSaving) => {
    state.comments.status.saving = isSaving;
  },
  updateCommentAtIndex: (state, { index, updatedComment }) => {
    state.comments.list.splice(index, 1, updatedComment);
  },
};

const getters = {
  post: state => state.data,
  comments: state => state.comments.list,
  postFormTitle: state => state.form.title,
  postFormBody: state => state.form.content,
  isSavingPost: state => state.status.saving,
  isPostSaved: state => state.status.saved,
  isPostEditable: state => state.status.editable,
  isLikingPost: state => state.status.liking,
  isPostContentChanged: state => state.status.contentChanged,
  commentFormBody: state => state.comments.form.body,
  isCreatingComment: state => state.comments.status.creating,
  isSavingComment: state => state.comments.status.saving,
  isCommentSaved: state => state.comments.status.saved,
  isLikingComment: state => state.comments.status.liking,
};

const state = {
  data: false,
  form: {
    title: '',
    content: '',
  },
  status: {
    saving: false,
    saved: false,
    contentChanged: false,
    liking: false,
    editable: false,
  },
  comments: {
    list: [],
    status: {
      loading: false,
      creating: false,
      saving: false,
      saved: false,
      liking: false,
    },
    form: {
      body: '',
    },
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
