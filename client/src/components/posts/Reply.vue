<template>
  <div class="reply" :class="{first: index === 0}">
    <header>
      <span class="username">{{ reply.author.username }}</span>
      <span class="date">{{ date }}</span>
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
      <div v-if="!edit && belongsToUser" class="controls">
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
    </main>
  </div>
</template>

<script>
import moment from 'moment';
import Spinner from '../Spinner';
import TextArea from '../reusable/forms/TextArea';

export default {
  name: 'Reply',
  components: {
    TextArea,
    Spinner,
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
  /* margin: 15px 0; */
  padding: 5px 0 25px 15px;
  background: var(--white);
  border-left: 2px solid #aaa;
}
.reply.first {
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
.delete {
  color: var(--error-red);
  cursor: pointer;
  margin-left: 5px;
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
  margin: 10px 0 0;
  font-size: 0.85em;
}
</style>
