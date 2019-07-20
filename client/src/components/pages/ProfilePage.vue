<template>
  <div id="page">
    <div class="container">
      <div class="user-info" v-if="user">
        <header>
          <nav class="user-secondary-nav">
            <span class="brand">{{ user.username }}</span>
          </nav>
        </header>
        <div class="user-content">
          <profile-photo
            class="profile-img-lg profile-img"
            v-lazy:background-image="user.photo ? `/api/photos/${user.photo}` : null"
            :style="{
              backgroundImage: !user.photo && `url('/static/images/auth/error.png')`,
              backgroundSize: 'cover',
            }"
          />
          <div class="bio">
            <h2>Bio</h2>
            {{ user.bio || `${user.username} has no bio.` }}
          </div>
        </div>
      </div>
      <nav class="secondary-nav">
        <span class="brand">Recent Posts</span>
        <a
          class="btn blue border sm"
          :href="`/posts/users/${ $route.params.userId }`"
        >
          View All Posts
        </a>
      </nav>
      <div v-if="recentPosts && !recentPosts.length">This user has not made any posts</div>
      <div v-if="recentPosts && recentPosts.length" class="recent-posts">
        <PostListItem
          v-for="(post, index) in recentPosts"
          :key="post._id"
          :index="index"
          :post="post"
          v-on:like="updateLikes"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';
import PostListItem from '../posts/PostListItem';
import ProfilePhoto from '../profile/ProfilePhoto';

export default {
  name: 'ProfilePage',
  components: {
    ProfilePhoto,
    PostListItem,
  },
  data() {
    return {
      user: null,
      recentPosts: null,
    };
  },
  mounted() {
    this.getUser();
    this.getPosts();
  },
  methods: {
    async getUser() {
      try {
        const res = await axios({
          method: 'GET',
          url: `/api/users/${this.$route.params.userId}`,
        });

        this.user = res.data;
      } catch (err) {
        this.user = false;
      }
    },
    async getPosts() {
      try {
        // Get 5 most recent posts for category
        const res = await axios({
          method: 'GET',
          url: `/api/posts/users/${this.$route.params.userId}/recent`,
        });
        this.recentPosts = res.data;
      } catch (err) {
        this.recentPosts = [];
      }
    },
    updateLikes({ index, updatedPost }) {
      // update posts array at index with updated post
      Vue.set(this.recentPosts, index, updatedPost);
    },
  },
};
</script>

<style scoped>
  .user-info {
    background: var(--white);
    border-radius: 15px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
  }
  .user-secondary-nav {
    border: none;
    padding: 15px 25px;
    border-radius: 15px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    background: var(--white);
    display: flex;
    align-items: center;
  }
  .brand {
    font-weight: bold;
    margin-right: auto;
    font-size: 1.1em;
  }
  .user-content {
    display: flex;
    padding: 30px 50px;
  }
  .profile-img {
    margin-right: 50px;
  }
  .bio {
    flex: 1;
  }
  h2 {
    margin: 10px 0;
    border-bottom: 2px solid var(--black);
  }
  h3 {
    margin-top: 10px;
  }
  .secondary-nav {
    margin-top: 40px;
  }
</style>
