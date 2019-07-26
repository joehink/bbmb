<template>
  <div>
    <ProfilePhoto
      v-if="to[0]"
      class="profile-img-md to-photo"
      :key="to[0].photo ? to[0].photo : null"
      v-lazy:background-image="to[0].photo ? `/api/photos/${to[0].photo}` : null"
      :style="{
        backgroundImage: !to[0].photo && `url('/static/images/auth/error.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }"
    />
    <span class="to" v-for="participant in to" :key="participant.username">
      {{ participant.username }}
    </span>
  </div>
</template>

<script>
import ProfilePhoto from '../profile/ProfilePhoto';

export default {
  name: 'ConversationHeader',
  components: {
    ProfilePhoto,
  },
  props: ['to'],
};
</script>
