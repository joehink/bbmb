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
      <div v-if="!edit" class="controls">
        <font-awesome-icon
          icon="reply"
          class="reply"
        />
        <font-awesome-icon
          icon="edit"
          class="edit"
          v-if="belongsToUser"
          v-on:click="toggleEdit"
        />
        <font-awesome-icon
          icon="trash-alt"
          class="trash"
          v-if="belongsToUser"
        />
      </div>
    </header>
    <text-area
      v-if="edit"
      v-model="body"
    />
    <div v-else class="body">
      {{ comment.body }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import Spinner from '../Spinner';
import TextArea from '../reusable/forms/TextArea';

export default {
  name: 'Comment',
  components: {
    TextArea,
    Spinner,
  },
  props: ['comment', 'index', 'token', 'belongsToUser'],
  data() {
    return {
      liking: false,
      body: this.comment.body,
      edit: false,
      saving: false,
    };
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
  margin-bottom: 10px;
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
.reply {
  margin: 0 10px 0 0;
}
.like-count {
  margin: 2px auto 0 0;
}
.trash {
  margin-left: 10px;
  color: var(--error-red);
  cursor: pointer;
}
.edit {
  cursor: pointer;
}
.body {
  border-left: 2px solid #aaa;
  padding-left: 10px;
}
.btn:last-child {
  margin-left: 5px;
}
</style>
