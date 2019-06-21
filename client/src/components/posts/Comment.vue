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

      Reply
      <font-awesome-icon
        icon="reply"
        class="reply-icon"
        v-on:click="toggleReplying"
      />
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
        v-on:click="toggleEdit"
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
      <div v-if="!edit && !replying && belongsToUser" class="controls">
        <font-awesome-icon
          icon="edit"
          class="edit"
          v-on:click="toggleEdit"
        />
        <font-awesome-icon
          icon="trash-alt"
          class="delete"
        />
      </div>
      <text-area
        class="textarea"
        v-if="replying"
        v-model="replyBody"
        placeholder="Reply goes here..."
      />
      <button
        class="btn border blue sm"
        v-if="replying"
        v-on:click="toggleReplying"
      >
        Cancel
      </button>
      <button
        v-if="replying"
        class="btn border green sm"
        :disabled="saving"
        v-on:click="addReply"
      >
        <Spinner v-if="saving" class="btn-spinner green" />
        Save
      </button>

      <reply
        v-for="(reply, index) in comment.replies"
        :key="reply._id"
        :reply="reply"
        :index="index"
        :belongsToUser="reply.author._id === userId"
      />
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import Reply from '../posts/Reply';
import Spinner from '../Spinner';
import TextArea from '../reusable/forms/TextArea';

export default {
  name: 'Comment',
  components: {
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
    toggleEdit() {
      this.edit = !this.edit;
    },
    toggleReplying() {
      this.replying = !this.replying;
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
  margin: 2px auto 0 0;
}
.delete {
  color: var(--error-red);
  cursor: pointer;
  margin-left: 5px;
}
.delete:hover {
  opacity: 0.5;
}
.edit {
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
}
.controls {
  box-shadow: 0 3px 6px rgba(0,0,0,0.25);
  border-radius: 15px;
  padding: 5px 10px;
  display: inline-block;
  border: 1px solid var(--primary-color);
  margin: 10px 0;
  font-size: 0.85em;
}
</style>
