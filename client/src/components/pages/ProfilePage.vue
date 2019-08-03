<template>
  <div id="page">
    <div class="container">
      <div class="user-info" v-if="pageUser">
        <header>
          <nav class="user-secondary-nav">
            <span class="brand">{{ pageUser.username }}</span>
            <button
              v-if="user && pageUser._id !== user._id"
              class="btn green border sm"
              @click="findOrStartConversation({ user, to: pageUser })"
            >
              Send Message
            </button>
            <button
              v-if="user && !editBio && pageUser._id === user._id"
              class="btn blue border sm"
              @click="beginEditBio"
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
                backgroundPosition: 'center center',
              }"
            />
            <div class="btn-group">
              <label
                v-if="user && !upload && pageUser._id === user._id"
                class="btn green border sm file-input"
              >
                Change Photo
                <input
                  type="file"
                  v-on:change="getImage"
                  accept="image/*"
                  id="file-input"
                >
              </label>
              <button v-if="upload" class="btn blue border sm" v-on:click="cancelUpload">
                Cancel
              </button>
              <button
                v-if="upload"
                :disabled="saving"
                class="btn green border sm upload"
                v-on:click="updateImage"
              >
                <Spinner v-if="saving" class="btn-spinner green" />
                Upload
              </button>
            </div>
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
                v-on:click="cancelEditBio"
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
        <router-link
          class="btn blue border sm"
          :to="`/posts/users/${ $route.params.userId }`"
        >
          View All Posts
        </router-link>
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
import { mapActions, mapGetters, mapMutations } from 'vuex';
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
      upload: false,
      mimeType: '',
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
    ...mapActions(['findOrStartConversation']),
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
          this.photo = `/api/photos/${res.data.photo}`;
          this.saving = false;
          this.editBio = false;
        }
      } catch (err) {
        this.saving = false;
      }
    },
    updateImage() {
      if (this.user && this.user._id === this.pageUser._id && !this.saving) {
        this.saving = true;
        const resizedCanvas = document.createElement('canvas');
        const context = resizedCanvas.getContext('2d');

        const img = new Image();
        img.onload = () => {
          const newHeight = (img.height / img.width) * 200;
          resizedCanvas.width = 200;
          resizedCanvas.height = newHeight;
          context.drawImage(img, 0, 0, img.width, img.height, 0, 0, 200, newHeight);
          resizedCanvas.toBlob(async (resizedImage) => {
            try {
              const formData = new FormData();
              formData.append('file', resizedImage);
              const res = await axios({
                url: '/api/users/',
                method: 'PUT',
                headers: {
                  authorization: this.token,
                  'Content-Type': 'multipart/form-data',
                },
                data: formData,
              });
              this.setUser(res.data);
              this.pageUser = res.data;
              this.photo = `/api/photos/${res.data.photo}`;
              this.saving = false;
              this.upload = false;
            } catch (err) {
              this.saving = false;
            }
          }, this.mimeType);
        };
        img.src = this.photo;
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
      this.mimeType = image.type;
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.upload = true;
        this.photo = e.target.result;
        this.editBio = false;
      };
    },
    updateLikes({ index, updatedPost }) {
      // update posts array at index with updated post
      Vue.set(this.recentPosts, index, updatedPost);
    },
    cancelUpload() {
      this.photo = `/api/photos/${this.pageUser.photo}`;
      this.upload = false;
    },
    cancelEditBio() {
      this.editBio = false;
      this.bio = this.pageUser.bio;
    },
    beginEditBio() {
      this.editBio = true;
      this.cancelUpload();
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
    flex-direction: column;
    text-align: center;
  }
  .brand {
    font-weight: bold;
    font-size: 1.1em;
    display: block;
    margin-bottom: 15px;
  }
  .user-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 23px 30px 25px;
  }
  .bio {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: auto;
    padding: 0 2px;
    margin-top: 15px;
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
  .btn-group {
    display: flex;
    justify-content: center;
  }
  .btn-group .upload {
    margin-left: 5px;
  }
  .file-input {
    margin-bottom: 0;
    font-style: normal;
    font-size: 1em;
  }
  .file-input input[type=file] {
    display: none;
  }

  @media(min-width: 768px) {
    .user-content {
      flex-direction: row;
      align-items: flex-start;
      padding: 30px 48px 30px 50px;
    }
    .profile-img-container {
      margin-right: 48px;
    }
    .bio {
      margin-top: 0;
      width: unset;
    }
    .textarea {
      flex: 1;
    }
    .brand {
      margin-right: auto;
      margin-bottom: 0;
    }
    .user-secondary-nav {
      flex-direction: row;
      align-items: center;
    }
  }
</style>
