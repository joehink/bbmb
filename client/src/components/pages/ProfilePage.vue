<template>
  <div id="page">
    <div class="container">
      <profile-photo
        v-if="user"
        class="profile-img-lg"
        v-lazy:background-image="user.photo ? `/api/photos/${user.photo}` : null"
        :style="{
          backgroundImage: !user.photo && `url('/static/images/auth/error.png')`,
          backgroundSize: 'cover',
        }"
      />
      {{ user.username }}
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

<style scoped></style>
