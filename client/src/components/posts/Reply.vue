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
      >
        <Spinner v-if="saving" class="btn-spinner green" />
        Save
      </button>
      <div v-else class="body">{{ reply.body }}</div>
    </main>
  </div>
</template>

<script>
import moment from 'moment';
import DropDownMenu from '../reusable/DropDownMenu';
import Spinner from '../Spinner';
import TextArea from '../reusable/forms/TextArea';

export default {
  name: 'Reply',
  components: {
    TextArea,
    Spinner,
    DropDownMenu,
  },
  props: ['reply', 'index', 'token', 'belongsToUser'],
  data() {
    return {
      liking: false,
      body: this.reply.body,
      edit: false,
      saving: false,
    };
  },
  computed: {
    date() {
      // format date posted using moment
      return moment(this.reply.createdAt).format('MMMM D, YYYY');
    },
  },
  methods: {
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
