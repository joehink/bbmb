<template>
  <div class="post-list-item">
    <div class="likes">
      <div v-on:click="likePost">
        <lottie
          :options="defaultOptions"
          :height="40"
          :width="40"
          v-on:animCreated="handleAnimation"
          class="sun"
        />
      </div>
      <span class="like-count">{{ post.likesCount }}</span>
    </div>
    <div class="post-info">
      <router-link :to="`/posts/${post._id}`" class="post-link">
        <h3 class="single-line-title">{{ post.title }}</h3>
      </router-link>
      <span class="post-data single-line-data">
        {{ date }} by
        <router-link class="user-link" :to="`/users/${post.author._id}`">
          {{ post.author.username }}
        </router-link>
      </span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Lottie from 'vue-lottie';
import { mapGetters } from 'vuex';
import moment from 'moment';
import animationData from '../../../static/images/sun.json';
import router from '../../router';

export default {
  name: 'PostListItem',
  components: {
    Lottie,
  },
  props: ['post', 'index'],
  data() {
    return {
      liking: false,
      defaultOptions: {
        animationData,
        loop: false,
        autoplay: false,
      },
    };
  },
  computed: {
    ...mapGetters(['token', 'isLoggedIn']),
    date() {
      // format date posted using moment
      return moment(this.post.createdAt).format('MMMM D, YYYY');
    },
  },
  methods: {
    handleAnimation(anim) {
      this.anim = anim;
    },
    async likePost() {
      try {
        if (!this.isLoggedIn) {
          // if user is not logged in
          router.push({ path: '/auth/required', query: { message: 'You must be logged in to like a post.' } });
        } else if (!this.liking) {
          // if like request is not being made
          this.liking = true;
          this.anim.loop = true;
          this.anim.play();
          // Make request to like or unlike post
          const res = await axios({
            method: 'PATCH',
            url: `/api/posts/${this.post._id}/like`,
            headers: {
              authorization: this.token,
            },
          });
          const updatedPost = res.data;
          // Emit custom 'like' event
          this.$emit('like', { index: this.index, updatedPost });
          this.liking = false;
          this.anim.loop = this.anim.playCount;
        }
      } catch (err) {
        this.liking = false;
        this.anim.loop = this.anim.playCount;
      }
    },
  },
};
</script>

<style scoped>
  .post-list-item {
    display: flex;
    align-items: center;
    padding: 7.5px 25px 7.5px 20px;
    background: var(--white);
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    margin-bottom: 10px;
    border-radius: 10px;
  }
  .post-list-item.recent {
    border-bottom: 1px solid #ddd;
    border-radius: 0;
    margin: 0;
    box-shadow: none;
  }
  .post-list-item.recent:first-of-type {
    border-top: 1px solid #ddd;
  }
  .post-link {
    color: var(--black);
  }
  .likes {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 5px;
  }
  .sun {
    cursor: pointer;
  }
  .post-data {
    color: var(--gray-text);
    font-size: .8em;
    margin-top: 6px;
  }
  .single-line-title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* number of lines to show */
    line-height: 1.25;        /* fallback */
    max-height: 1.25em;       /* fallback */
  }
  .single-line-data {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* number of lines to show */
    line-height: 1;        /* fallback */
    max-height: 1em;       /* fallback */
  }
</style>
