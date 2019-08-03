<template>
  <div class="comment">
    <header>
      <div class="username-date">
        <router-link class="user-link username" :to="`/users/${comment.author._id}`">
          {{ comment.author.username }}
        </router-link>
        <span class="date">{{ date }}</span>
      </div>
      <div class="like-count-menu-reply">
        <div v-on:click="likeComment">
          <lottie
            :options="defaultOptions"
            :height="25"
            :width="25"
            v-on:animCreated="handleAnimation"
            class="sun"
          />
        </div>
        <span class="like-count">{{ comment.likesCount }}</span>
        <drop-down-menu
          v-if="belongsToUser"
          class="control-menu"
          :controls="[{
            text: 'Edit',
            action: () => {this.edit = true; this.replying = false},
            show: belongsToUser,
          }, {
            text: 'Delete',
            action: () => {
              this.displayModal({
                message: 'Are you sure you want to delete this comment?',
                btnText: 'Delete',
                btnColor: 'red',
                action: () => this.deleteComment(index),
              });
            },
            show: belongsToUser,
          }]"
        />
        <button class="reply-button" v-on:click="replying = true">
          <font-awesome-icon icon="reply" />
        </button>
      </div>
    </header>
    <main>
      <text-area
        class="textarea"
        v-if="edit"
        v-model="body"
      />
      <button
        class="btn border blue sm"
        v-if="edit"
        v-on:click="edit = false"
      >
        Cancel
      </button>
      <button
        v-if="edit"
        class="btn border green sm"
        :disabled="saving"
        v-on:click="updateComment"
      >
        <Spinner v-if="saving" class="btn-spinner green" />
        Save
      </button>
      <div v-else class="body" v-html="commentWithLinks"></div>
      <text-area
        class="textarea"
        v-if="replying & !edit"
        v-model="replyBody"
        placeholder="Reply goes here..."
      />
      <button
        class="btn border blue sm"
        v-if="replying & !edit"
        v-on:click="replying = false;"
      >
        Cancel
      </button>
      <button
        v-if="replying & !edit"
        class="btn border green sm"
        :disabled="saving"
        v-on:click="addReply"
      >
        <Spinner v-if="saving" class="btn-spinner green" />
        Save
      </button>

      <div v-if="showReplies">
        <reply
          v-for="(reply, replyIndex) in comment.replies"
          :key="reply._id"
          :reply="reply"
          :index="replyIndex"
          :commentIndex="index"
          :token="token"
          :commentId="comment._id"
          :belongsToUser="reply.author._id === userId"
          @updateComment="emitUpdateComment"
          :displayModal="displayModal"
          :hideModal="hideModal"
          :setDisableModal="setDisableModal"
          @removeReply="removeReplyAtIndex"
        />
      </div>
    </main>
    <button
      v-if="comment.replies && comment.replies.length"
      class="toggle-replies"
      v-on:click="showReplies = !showReplies"
    >
      {{ showReplies ? 'Hide Replies' : 'Show Replies' }}
    </button>
  </div>
</template>

<script>
import Autolinker from 'autolinker';
import axios from 'axios';
import Lottie from 'vue-lottie';
import moment from 'moment';
import animationData from '../../../static/images/sun.json';
import DropDownMenu from '../reusable/DropDownMenu';
import Reply from '../posts/Reply';
import router from '../../router';
import Spinner from '../Spinner';
import TextArea from '../reusable/forms/TextArea';

export default {
  name: 'Comment',
  components: {
    DropDownMenu,
    TextArea,
    Spinner,
    Reply,
    Lottie,
  },
  props: ['comment', 'index', 'token', 'belongsToUser', 'userId', 'displayModal', 'setDisableModal', 'hideModal'],
  data() {
    return {
      liking: false,
      body: this.comment.body,
      edit: false,
      saving: false,
      replying: false,
      replyBody: '',
      showReplies: false,
      deleting: false,
      defaultOptions: {
        animationData,
        loop: false,
        autoplay: false,
      },
    };
  },
  watch: {
    edit() {
      this.body = this.comment.body;
    },
  },
  computed: {
    date() {
      // format date posted using moment
      return moment(this.comment.createdAt).format('MMMM D, YYYY');
    },
    commentWithLinks() {
      return Autolinker.link(this.comment.body, { newWindow: true });
    },
  },
  methods: {
    async likeComment() {
      try {
        if (!this.token) {
          // user is not logged in
          router.push({ path: '/auth/required', query: { message: 'You must be logged in to like a comment.' } });
        } else if (!this.liking) {
          // if like request is not being made
          this.liking = true;
          this.anim.loop = true;
          this.anim.play();
          // Make request to like or unlike post
          const res = await axios({
            method: 'PATCH',
            url: `/api/posts/${this.$route.params.postId}/comments/${this.comment._id}/like`,
            headers: {
              authorization: this.token,
            },
          });
          this.$emit('likeComment', { index: this.index, updatedComment: res.data });
          this.liking = false;
          this.anim.loop = this.anim.playCount;
        }
      } catch (err) {
        this.liking = false;
        this.anim.loop = this.anim.playCount;
      }
    },
    async updateComment() {
      try {
        if (!this.token) {
          // user is not logged in
          router.push({ path: '/auth/required', query: { message: 'You must be logged in to update a comment' } });
        } else if (this.body && this.belongsToUser && !this.saving) {
          this.saving = true;
          const res = await axios({
            method: 'PATCH',
            url: `/api/posts/${this.$route.params.postId}/comments/${this.comment._id}`,
            headers: {
              authorization: this.token,
            },
            data: {
              body: this.body,
            },
          });

          this.$emit('updateComment', { index: this.index, updatedComment: res.data });
          this.saving = false;
          this.edit = false;
        }
      } catch (err) {
        this.saving = false;
      }
    },
    async addReply() {
      try {
        if (!this.token) {
          // user is not logged in
          router.push({ path: '/auth/required', query: { message: 'You must be logged in to reply to a comment.' } });
        } else if (this.replyBody && !this.saving) {
          this.saving = true;
          const res = await axios({
            method: 'POST',
            url: `/api/posts/${this.$route.params.postId}/comments/${this.comment._id}`,
            headers: {
              authorization: this.token,
            },
            data: {
              body: this.replyBody,
            },
          });

          this.$emit('updateComment', { index: this.index, updatedComment: res.data });
          this.saving = false;
          this.replying = false;
          this.replyBody = '';
        }
      } catch (err) {
        this.saving = false;
      }
    },
    async deleteComment(index) {
      try {
        if (!this.token) {
          // user is not logged in
          router.push({ path: '/auth/required', query: { message: 'You must be logged in to delete a comment.' } });
        } else if (this.belongsToUser && !this.deleting) {
          this.deleting = true;
          this.setDisableModal(true);
          await axios({
            method: 'DELETE',
            url: `/api/posts/${this.$route.params.postId}/comments/${this.comment._id}`,
            headers: {
              authorization: this.token,
            },
          });
          this.$emit('removeComment', index);
          this.deleting = false;
          this.setDisableModal(false);
          this.hideModal();
        }
      } catch (err) {
        this.deleting = false;
        this.setDisableModal(false);
        this.hideModal();
      }
    },
    emitUpdateComment({ index, updatedComment }) {
      this.$emit('updateComment', { index, updatedComment });
    },
    removeReplyAtIndex(index) {
      this.comment.replies.splice(index, 1);
    },
    handleAnimation(anim) {
      this.anim = anim;
    },
  },
};
</script>

<style scoped>
.comment {
  padding: 15px 25px;
  background: var(--white);
  box-shadow: 0 3px 6px rgba(0,0,0,0.25);
  margin-bottom: 20px;
  border-radius: 10px;
}
.comment header {
  display: flex;
  flex-direction: column;
  padding-bottom: 15px;
}
.comment main {
  border-left: 2px solid #aaa;
  padding-left: 15px;
}
.username {
  background: #ddd;
  border-radius: 20px;
  display: inline-block;
  padding: 2.5px 15px;
  font-size: .9em;
}
.date {
  color: #aaa;
  font-size: .9em;
  margin: 0 5px 0 7.5px;
}
.sun {
  cursor: pointer;
  margin: 0 2.5px 0 10px;
}
.reply-icon {
  margin-left: 5px;
  cursor: pointer;
}
.textarea {
  margin: 15px 5px;
  white-space: pre-wrap;
  line-height: 1.4;
}
.body {
  white-space: pre-line;
  line-height: 1.4;
  overflow-x: auto;
}
.toggle-replies {
  margin: 15px auto 0;
  display: block;
  background: none;
  border: none;
  color: #888;
}
.toggle-replies:hover {
  color: var(--primary-color);
}
.control-menu {
  margin: 0 0 0 10px;
}
.reply-button {
  border: none;
  background: none;
  font-size: 0.9em;
}
.like-count-menu-reply {
  display: flex;
  align-items: center;
  flex: 1;
  margin-top: 10px;
}

@media(min-width: 400px) {
  .like-count-menu-reply {
    margin-top: 0;
  }
  .comment header {
    /* flex-wrap: wrap; */
    align-items: center;
    flex-direction: row;
  }
  .reply-button {
    margin-left: auto;
  }
}
</style>
