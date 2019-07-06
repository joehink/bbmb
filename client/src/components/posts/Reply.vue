<template>
  <div class="reply" :class="{first: index === 0}">
    <header>
      <span class="username">{{ reply.author.username }}</span>
      <span class="date">{{ date }}</span>
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
              message: 'Are you sure you want to delete this Reply?',
              btnText: 'Delete',
              btnColor: 'red',
              action: deleteReply,
            });
          },
          show: belongsToUser,
        }]"
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
        v-on:click="editReply"
      >
        <Spinner v-if="saving" class="btn-spinner green" />
        Save
      </button>
      <div v-else class="body">{{ reply.body }}</div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import DropDownMenu from '../reusable/DropDownMenu';
import router from '../../router';
import Spinner from '../Spinner';
import TextArea from '../reusable/forms/TextArea';

export default {
  name: 'Reply',
  components: {
    TextArea,
    Spinner,
    DropDownMenu,
  },
  props: ['reply', 'index', 'commentIndex', 'token', 'belongsToUser', 'commentId', 'displayModal'],
  data() {
    return {
      liking: false,
      body: this.reply.body,
      edit: false,
      saving: false,
      deleting: false,
    };
  },
  computed: {
    date() {
      // format date posted using moment
      return moment(this.reply.createdAt).format('MMMM D, YYYY');
    },
  },
  methods: {
    async editReply() {
      try {
        if (!this.token) {
          // user is not logged in
          router.push('/auth/required');
        } else if (this.body && this.belongsToUser && !this.saving) {
          this.saving = true;
          const res = await axios({
            method: 'PATCH',
            url: `/api/posts/${this.$route.params.postId}/comments/${this.commentId}/replies/${this.reply._id}`,
            headers: {
              authorization: this.token,
            },
            data: {
              body: this.body,
            },
          });
          this.$emit('updateComment', { index: this.commentIndex, updatedComment: res.data });
          this.saving = false;
          this.edit = false;
        }
      } catch (err) {
        this.saving = false;
      }
    },
    async deleteReply() {
      try {
        if (!this.token) {
          // user is not logged in
          router.push('/auth/required');
        } else if (this.belongsToUser && !this.deleting) {
          this.deleting = true;
          await axios({
            method: 'DELETE',
            url: `/api/posts/${this.$route.params.postId}/comments/${this.commentId}/replies/${this.reply._id}`,
            headers: {
              authorization: this.token,
            },
          });
          this.$emit('removeReply', this.index);
          this.deleting = false;
        }
      } catch (err) {
        this.deleting = false;
      }
    },
    toggleEdit() {
      this.edit = !this.edit;
    },
    toggleReplying() {
      this.replying = !this.replying;
    },
  },
};
</script>

<style scoped>
.reply {
  padding: 25px 0 5px 15px;
  background: var(--white);
  border-left: 2px solid #aaa;
}
.reply.first {
  padding-top: 5px;
  margin-top: 15px;
}
.reply header {
  display: flex;
  align-items: center;
  padding-bottom: 15px;
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
.textarea {
  margin: 15px 5px;
  white-space: pre-wrap;
  line-height: 1.4;
}
.body {
  white-space: pre-line;
  line-height: 1.4;
}
.control-menu {
  margin: 2.5px 0 0 10px;
}
</style>
