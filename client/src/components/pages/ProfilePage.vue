<template>
  <div id="page">
    <div class="container">
      <div class="user-info">
        <div v-if="user" class="photo-username">
          <profile-photo
            class="profile-img-lg"
            v-lazy:background-image="user.photo ? `/api/photos/${user.photo}` : null"
            :style="{
              backgroundImage: !user.photo && `url('/static/images/auth/error.png')`,
              backgroundSize: 'cover',
            }"
          />
          <h3>{{ user.username }}</h3>
        </div>
        <div class="bio">
          <h2>Bio</h2>
          {{ user.bio || 'This user has no bio.' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ProfilePhoto from '../profile/ProfilePhoto';

export default {
  name: 'ProfilePage',
  components: {
    ProfilePhoto,
  },
  data() {
    return {
      user: null,
    };
  },
  mounted() {
    this.getUser();
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
  },
};
</script>

<style scoped>
  .user-info {
    background: var(--white);
    border-radius: 15px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    display: flex;
    padding: 15px 50px;
  }
  .photo-username {
    text-align: center;
    margin-right: 25px;
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
</style>
