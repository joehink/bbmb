<template>
  <div class="conversation-header">
    <router-link class="conversations-link" to="/conversations">
      <font-awesome-icon
        icon="list-ul"
      />
    </router-link>
    <ProfilePhoto
      v-if="to && to[0]"
      class="profile-img-md to-photo"
      :key="to[0].photo ? to[0].photo : null"
      v-lazy:background-image="to[0].photo ? `/api/photos/${to[0].photo}` : null"
      :style="{
        backgroundImage: !to[0].photo && `url('/static/images/auth/error.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }"
    />
    <div v-if="to && to[0]">
      <router-link
        v-for="participant in to"
        :key="participant.username"
        class="to user-link"
        :to="`/users/${participant._id}`"
      >
        {{ participant.username }}
      </router-link>
    </div>
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

<style scoped>
.conversation-header {
  background: #EAEAEA;
  padding: 10px 15px;
  display: flex;
  align-items: center;
}
.to {
  font-weight: 700;
  font-size: 1.25em;
  margin-left: 10px;
  color: var(--black);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 175px;
  display: inline-block;
}
.conversations-link {
  font-size: 1.25em;
  background: var(--white);
  border-radius: 5px;
  padding: 5px;
  margin-right: 10px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.25);
  cursor: pointer;
  color: var(--black);
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (min-width: 400px) {
  .to {
    max-width: unset;
  }
}

@media (min-width: 768px) {
  .conversations-link {
    display: none;
  }
}
</style>

