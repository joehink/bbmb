<template>
  <router-link
    :to="`/conversations/${conversation._id}`"
    class="conversation-list-item"
    @click.native="$emit('close')"
  >
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
    <div>
      <span class="to" v-for="participant in to" :key="participant._id">
        {{ participant.username }}
      </span>
      <div class="date">{{ timeSinceLastMessage }}</div>
    </div>
  </router-link>
</template>

<script>
import moment from 'moment';
import ProfilePhoto from '../profile/ProfilePhoto';

export default {
  name: 'ConversationListItem',
  components: {
    ProfilePhoto,
  },
  props: ['conversation', 'user'],
  computed: {
    to() {
      return this
        .conversation
        .participants.filter(participant => participant._id !== this.user._id);
    },
    timeSinceLastMessage() {
      return moment(this.conversation.updatedAt).fromNow();
    },
  },
};
</script>

<style scoped>
  .conversation-list-item {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #EAEAEA;
    color: var(--black);
  }
  .conversation-list-item:hover {
    background: #EFEFEF;
  }
  .conversation-list-item:first-of-type {
    border-top: 1px solid #EAEAEA;
  }
  .to-photo {
    margin-right: 10px;
  }
  .to {
    font-weight: 700;
    font-size: 1.1em;
  }
  .date {
    color: #aaa;
    font-size: .8em;
    margin-top: 5px;
  }

  @media (min-width: 768px) {
    .conversation-list-item:first-of-type {
      border-top: none;
    }
  }
</style>

