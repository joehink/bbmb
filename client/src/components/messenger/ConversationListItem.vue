<template>
  <router-link
    :to="`/conversations/${conversation._id}`"
    class="conversation-list-item"
    :class="{ selected }"
    @click.native="$emit('close')"
  >
      <div class="photo-container">
        <span v-if="unread" class="dot"></span>
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
      </div>
      <div class="conversation-data">
        <div class="username-date">
          <span class="to" v-for="participant in to" :key="participant._id">
            {{ participant.username }}
          </span>
          <span class="date">{{ timeSinceLastMessage }}</span>
        </div>
        <div class="last-message">
          {{ conversation.lastMessage }}
        </div>
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
  props: ['conversation', 'user', 'selected'],
  computed: {
    to() {
      return this
        .conversation
        .participants.filter(participant => participant._id !== this.user._id);
    },
    timeSinceLastMessage() {
      const now = moment();
      const messageDate = moment(this.conversation.lastMessageCreatedAt);

      if (messageDate.isSame(now, 'day')) {
        return messageDate.format('LT');
      } else if (messageDate.isSame(now, 'yesterday')) {
        return 'Yesterday';
      }

      return messageDate.format('MMM D');
    },
    unread() {
      return this.conversation.unread.some(recipient => recipient === this.user._id);
    },
  },
};
</script>

<style scoped>
  .conversation-list-item {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #EAEAEA;
    color: var(--black);
    display: flex;
    align-items: center;
    overflow-x: auto;
  }
  .conversation-list-item:hover {
    background: #EFEFEF;
  }
  .conversation-list-item:first-of-type {
    border-top: 1px solid #EAEAEA;
  }
  .selected {
    background: #EFEFEF;
  }
  .conversation-data {
    flex: 1;
  }
  .username-date {
    display: flex;
    align-items: center;
  }
  .date {
    color: #aaa;
    font-size: .7em;
    margin-left: auto;
  }
  .to-photo {
    margin-right: 10px;
  }
  .to {
    font-weight: 700;
    font-size: 1.1em;
    padding-right: 10px;
  }
  .photo-container {
    position: relative;
  }
  .dot {
    background: red;
    border-radius: 100%;
    width: 10px;
    height: 10px;
    display: block;
    position: absolute;
    top: 3px;
    right: 13px;
    box-shadow: 0 3px 6px rgba(255,0,0,0.75);
  }
  .last-message {
    color: #AAA;
    font-style: italic;
    margin-top: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-height: 1.2;
    max-height: 1.2em;
  }

  @media (min-width: 768px) {
    .conversation-list-item:first-of-type {
      border-top: none;
    }
  }
</style>

