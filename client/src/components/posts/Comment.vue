<template>
  <div class="comment">
    <header>
      <span class="username">{{ comment.author.username }}</span>
      <span class="date">{{ date }}</span>
      <font-awesome-icon
        class="sun"
        icon="sun"
        :class="{ spin: liking }"
        v-on:click="likeComment"
      />
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
          action: () => {this.edit = true; this.replying = false},
          show: belongsToUser,
        }]"
      />
      <button class="reply-button" v-on:click="replying = true">
        <font-awesome-icon icon="reply" /> Reply
      </button>
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
      <div v-else class="body">{{ comment.body }}</div>
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
import axios from 'axios';
import moment from 'moment';
import DropDownMenu from '../reusable/DropDownMenu';
import Reply from '../posts/Reply';
import Spinner from '../Spinner';
import TextArea from '../reusable/forms/TextArea';

export default {
  name: 'Comment',
  components: {
    DropDownMenu,
    TextArea,
    Spinner,
    Reply,
  },
  props: ['comment', 'index', 'token', 'belongsToUser', 'userId'],
  data() {
    return {
      liking: false,
      body: this.comment.body,
      edit: false,
      saving: false,
      replying: false,
      replyBody: '',
      showReplies: false,
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
  },
  methods: {
    async likeComment() {
      try {
        // if like request is not being made and user is logged in
        if (!this.liking && !!this.token) {
          this.liking = true;
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
        }
      } catch (err) {
        this.liking = false;
      }
    },
    async updateComment() {
      try {
        if (this.body && this.belongsToUser && !this.saving) {
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
        if (this.replyBody && !this.saving) {
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
    emitUpdateComment({ index, updatedComment }) {
      this.$emit('updateComment', { index, updatedComment });
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
  flex-wrap: wrap;
  align-items: center;
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
  margin-left: 10px;
}
.sun {
  font-size: 1.25em;
  color: goldenrod;
  cursor: pointer;
  margin: 0 2.5px 0 10px;
}
.reply-icon {
  margin-left: 5px;
  cursor: pointer;
}
.like-count {
  margin: 2px 0 0 0;
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
  margin: 2.5px 0 0 10px;
}
.reply-button {
  border: none;
  background: none;
  font-size: 0.9em;
  margin-left: auto;
}
</style>
