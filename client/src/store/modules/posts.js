import axios from 'axios';

const actions = {
  getPosts: async ({ commit, state }, { category, sort }) => {
    try {
      // If request is not currently being made and if there is a next page
      if (!state.loading && state.nextPage) {
        commit('setLoading', true);
        // fetch next page of posts
        const res = await axios({
          method: 'GET',
          url: `/api/posts/category/${category}`,
          params: {
            page: state.page + 1,
            sortBy: sort || null,
          },
        });
        commit('setFilter', 'category');
        // add posts array onto existing array of posts
        commit('pushToPosts', res.data.posts);
        commit('setNextPage', res.data.nextPage);
        commit('incrementPage');
        commit('setLoading', false);
      }
    } catch (err) {
      commit('setLoading', false);
    }
  },
  getUserPosts: async ({ commit, state }, { userId, sort }) => {
    try {
      // If request is not currently being made and if there is a next page
      if (!state.loading && state.nextPage) {
        commit('setLoading', true);
        // fetch next page of posts
        const res = await axios({
          method: 'GET',
          url: `/api/posts/users/${userId}`,
          params: {
            page: state.page + 1,
            sortBy: sort || null,
          },
        });
        // add posts array onto existing array of posts
        commit('setFilter', 'user');
        commit('pushToPosts', res.data.posts);
        commit('setNextPage', res.data.nextPage);
        commit('incrementPage');
        commit('setLoading', false);
      }
    } catch (err) {
      commit('setLoading', false);
    }
  },
  searchPosts: async ({ commit, state }, { searchTerm, sort }) => {
    try {
      // If request is not currently being made and if there is a next page
      if (!state.loading && state.nextPage) {
        commit('setLoading', true);
        // fetch next page of posts
        const res = await axios({
          method: 'GET',
          url: `/api/posts/search/${searchTerm}`,
          params: {
            page: state.page + 1,
            sortBy: sort || null,
          },
        });
        // add posts array onto existing array of posts
        commit('setFilter', 'search');
        commit('pushToPosts', res.data.posts);
        commit('setNextPage', res.data.nextPage);
        commit('incrementPage');
        commit('setLoading', false);
      }
    } catch (err) {
      commit('setLoading', false);
    }
  },
  resetPostsData: ({ commit }) => {
    commit('emptyPosts');
    commit('setPage', 0);
    commit('setNextPage', true);
  },
};

const mutations = {
  pushToPosts: (state, newPosts) => {
    state.posts = [...state.posts, ...newPosts];
  },
  emptyPosts: (state) => {
    state.posts = [];
  },
  setPosts: (state, posts) => {
    state.posts = posts;
  },
  setLoading: (state, isLoading) => {
    state.loading = isLoading;
  },
  incrementPage: (state) => {
    state.page += 1;
  },
  setPage: (state, pageValue) => {
    state.page = pageValue;
  },
  setNextPage: (state, nextPageExists) => {
    state.nextPage = nextPageExists;
  },
  setFilter: (state, filter) => {
    state.filter = filter;
  },
  updatePostAtIndex: (state, { index, updatedPost }) => {
    state.posts.splice(index, 1, updatedPost);
  },
  removePostAtIndex: (state, id) => {
    const index = state.posts.findIndex(post => post._id === id);
    state.posts.splice(index, 1);
  },
};

const getters = {
  posts: state => state.posts,
  isLoading: state => state.loading,
  postsFilter: state => state.filter,
};

const state = {
  posts: [],
  filter: '',
  page: 0,
  nextPage: true,
  loading: false,
};

export default {
  state,
  getters,
  actions,
  mutations,
};
