<template>
  <div class="post">
    <div class="post-header" v-if="post">
      <div class="likes">
        <font-awesome-icon
          v-on:click="likePost"
          class="sun"
          :class="{ spin: liking }"
          icon="sun"
        />
        <span class="like-count">{{ post.likesCount }}</span>
      </div>
      <div class="post-info">
          <h3>{{ post.title }}</h3>
        <span class="post-data">{{ date }} by {{ post.author.username }}</span>
      </div>
    </div>
    <div class="post-body" v-if="!edit">
      <p>{{ post.body }}</p>
    </div>
    <div class="editor" v-else>
      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="menubar">
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
          >
            <font-awesome-icon icon="bold" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
          >
            <font-awesome-icon icon="italic" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.strike() }"
            @click="commands.strike"
          >
            <font-awesome-icon icon="strikethrough" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.underline() }"
            @click="commands.underline"
          >
            <font-awesome-icon icon="underline" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.code() }"
            @click="commands.code"
          >
            <font-awesome-icon icon="code" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.paragraph() }"
            @click="commands.paragraph"
          >
            <font-awesome-icon icon="paragraph" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            @click="commands.heading({ level: 1 })"
          >
            H1
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            @click="commands.heading({ level: 2 })"
          >
            H2
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            @click="commands.heading({ level: 3 })"
          >
            H3
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bullet_list() }"
            @click="commands.bullet_list"
          >
            <font-awesome-icon icon="list-ul" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.ordered_list() }"
            @click="commands.ordered_list"
          >
            <font-awesome-icon icon="list-ol" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.blockquote() }"
            @click="commands.blockquote"
          >
            <font-awesome-icon icon="quote-right" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.code_block() }"
            @click="commands.code_block"
          >
            <font-awesome-icon icon="code" />
          </button>

          <button
            class="menubar__button"
            @click="commands.horizontal_rule"
          >
            <font-awesome-icon icon="grip-horizontal" />
          </button>

          <button
            class="menubar__button"
            @click="commands.undo"
          >
            <font-awesome-icon icon="undo" />
          </button>

          <button
            class="menubar__button"
            @click="commands.redo"
          >
            <font-awesome-icon icon="redo" />
          </button>
        </div>
      </editor-menu-bar>
      <editor-content :editor="editor" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions';
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  name: 'Post',
  components: {
    EditorContent,
    EditorMenuBar,
  },
  props: ['post'],
  data() {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
        ],
        content: this.post.body,
      }),
      edit: true,
      liking: false,
    };
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'token']),
    date() {
      // format date posted using moment
      return moment(this.post.createdAt).format('MMMM D, YYYY');
    },
  },
  methods: {
    async likePost() {
      try {
        // if like request is not being made and user is logged in
        if (!this.liking && this.isLoggedIn) {
          this.liking = true;
          // Make request to like or unlike post
          const res = await axios({
            method: 'PATCH',
            url: `/api/posts/${this.post._id}/like`,
            headers: {
              authorization: this.token,
            },
          });
          const updatedPost = res.data;
          this.$emit('likePost', updatedPost);
          this.liking = false;
        }
      } catch (err) {
        this.liking = false;
      }
    },
  },
};
</script>

<style scoped>
  .post {
    background: var(--white);
    border-radius: 15px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    border: 1px solid var(--primary-color);
    padding: 30px 40px;
    min-height: 300px;
  }
  .post-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #DDD;
    padding-bottom: 10px;
  }
  .likes {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;
  }
  .sun {
    font-size: 1.75em;
    color: goldenrod;
    cursor: pointer;
  }
  .like-count {
    margin-top: 5px;
  }
  .post-data {
    color: var(--gray-text);
    font-size: .8em;
    margin-top: 10px;
  }
  .post-body {
    padding: 0;
    white-space: pre-wrap;
    line-height: 1.5;
  }
</style>
