<template>
  <div id="page">
    <div class="container">
      <div class="user-info" v-if="pageUser">
        <header>
          <nav class="user-secondary-nav">
            <span class="brand">{{ pageUser.username }}</span>
            <button
              v-if="user && !editBio && pageUser._id === user._id"
              class="btn blue border sm"
              @click="editBio = !editBio"
            >
              Edit Bio
            </button>
          </nav>
        </header>
        <div class="user-content">
          <div class="profile-img-container">
            <profile-photo
              class="profile-img-lg profile-img"
              v-lazy:background-image="photo ? photo : null"
              :key="photo ? photo : null"
              :style="{
                backgroundImage: !pageUser.photo && `url('/static/images/auth/error.png')`,
                backgroundSize: 'cover',
              }"
            />
            <input type="file" v-on:change="getImage">
          </div>
          <div class="bio">
            <h2>Bio</h2>
            <p class="no-bio-text" v-if="bio !== null && !pageUser.bio && !editBio ">
              {{ `${pageUser.username} has no bio.` }}
            </p>
            <p class="bio-text" v-if="pageUser.bio && !editBio">{{ pageUser.bio }}</p>
            <text-area
              class="textarea"
              v-if="editBio"
              v-model="bio"
              placeholder="Bio goes here..."
            />
            <div>
              <button
                class="btn border blue sm"
                v-if="editBio"
                v-on:click="editBio = false;"
              >
                Cancel
              </button>
              <button
                v-if="editBio"
                class="btn border green sm"
                :disabled="saving"
                v-on:click="updateUser"
              >
                <Spinner v-if="saving" class="btn-spinner green" />
                Save
              </button>
            </div>
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
import { mapGetters, mapMutations } from 'vuex';
import Vue from 'vue';
import PostListItem from '../posts/PostListItem';
import ProfilePhoto from '../profile/ProfilePhoto';
import Spinner from '../Spinner';
import TextArea from '../reusable/forms/TextArea';

export default {
  name: 'ProfilePage',
  components: {
    ProfilePhoto,
    PostListItem,
    Spinner,
    TextArea,
  },
  data() {
    return {
      pageUser: null,
      bio: null,
      photo: null,
      recentPosts: null,
      saving: false,
      editBio: false,
    };
  },
  mounted() {
    this.getUser();
    this.getPosts();
  },
  watch: {
    editBio() {
      this.bio = this.pageUser.bio;
    },
  },
  computed: {
    ...mapGetters(['user', 'token']),
  },
  methods: {
    ...mapMutations(['setUser']),
    async getUser() {
      try {
        const res = await axios({
          method: 'GET',
          url: `/api/users/${this.$route.params.userId}`,
        });

        this.bio = res.data.bio;
        this.pageUser = res.data;
        if (res.data.photo) {
          this.photo = `/api/photos/${res.data.photo}`;
        }
      } catch (err) {
        this.pageUser = false;
      }
    },
    async updateUser() {
      try {
        if (this.user && this.user._id === this.pageUser._id && !this.saving) {
          this.saving = true;
          const res = await axios({
            url: '/api/users/',
            method: 'PUT',
            headers: {
              authorization: this.token,
            },
            data: {
              bio: this.bio,
            },
          });

          this.setUser(res.data);
          this.pageUser = res.data;
          this.saving = false;
          this.editBio = false;
        }
      } catch (err) {
        this.saving = false;
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
    getImage(event) {
      const image = event.target.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.photo = e.target.result;
      };
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
    padding: 30px 48px 30px 50px;
  }
  .profile-img-container {
    margin-right: 48px;
  }
  .bio {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-x: auto;
    padding: 0 2px;
  }
  .bio-text {
    margin: 0;
    white-space: pre-line;
    line-height: 1.25;
    flex: 1;
  }
  .no-bio-text {
    margin: 0;
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
  .textarea {
    margin-bottom: 10px;
    flex: 1;
  }
</style>
