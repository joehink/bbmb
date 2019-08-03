<template>
  <div class="post-list-item">

    <header>
      <div class="likes">
        <div v-on:click="likePost">
          <lottie
            :options="defaultOptions"
            :height="25"
            :width="25"
            v-on:animCreated="handleAnimation"
            class="sun"
          />
        </div>
        <span class="like-count">{{ post.likesCount }}</span>
      </div>
      <router-link class="user-link username" :to="`/users/${post.author._id}`">
        {{ post.author.username }}
      </router-link>
      <span class="date">{{ date }}</span>
    </header>
    <div class="post-info">
      <router-link :to="`/posts/${post._id}`" class="post-link">
        <h3 class="single-line-title">{{ post.title }}</h3>
      </router-link>
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
    padding: 15px 20px;
    background: var(--white);
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    margin-bottom: 20px;
    border-radius: 10px;
  }
  .post-list-item.recent {
    padding: 7.5px 20px;
    border-bottom: 1px solid #ddd;
    border-radius: 0;
    margin: 0;
    box-shadow: none;
  }
  .post-list-item.recent .single-line-title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-height: 1.25;
    max-height: 1.25em;
  }
  .post-list-item.recent:first-of-type {
    border-top: 1px solid #ddd;
  }
  .post-list-item header {
    display: flex;
    margin-bottom: 10px;
    margin-left: -5px;
    flex-wrap: wrap;
    align-items: center;
    flex-direction: row;
  }
  .post-list-item.recent .username {
    max-width: 80px;
  }
  .username {
    background: #ddd;
    border-radius: 20px;
    display: inline-block;
    padding: 2.5px 10px;
    font-size: .8em;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-left: 7.5px;
    max-width: 80px;
  }
  .date {
    color: #aaa;
    font-size: .9em;
    margin: 0 0 0 7.5px;
  }
  .sun {
    cursor: pointer;
    margin: 0 2.5px 0 10px;
  }
  .likes {
    display: flex;
    align-items: center;
  }
  .post-link {
    color: var(--black);
  }

  @media(min-width: 768px) {
    .username {
      max-width: unset;
    }
  }
</style>
