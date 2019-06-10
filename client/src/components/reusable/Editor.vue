<template>
  <div class="editor">
    <editor-menu-bar
      :editor="editor"
      v-slot="{ commands, isActive }"
      v-if="displayMenu"
    >
      <div class="menubar">
        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <font-awesome-icon icon="bold" />
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <font-awesome-icon icon="italic" />
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <font-awesome-icon icon="strikethrough" />
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <font-awesome-icon icon="underline" />
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.paragraph() }"
          @click="commands.paragraph"
        >
          <font-awesome-icon icon="paragraph" />
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <font-awesome-icon icon="list-ul" />
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <font-awesome-icon icon="list-ol" />
        </button>

        <button
          class="menubar-button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <font-awesome-icon icon="quote-right" />
        </button>

        <button
          class="menubar-button"
          @click="commands.horizontal_rule"
        >
          <font-awesome-icon icon="grip-horizontal" />
        </button>

        <button
          class="menubar-button"
          @click="commands.undo"
        >
          <font-awesome-icon icon="undo" />
        </button>

        <button
          class="menubar-button"
          @click="commands.redo"
        >
          <font-awesome-icon icon="redo" />
        </button>
      </div>
    </editor-menu-bar>
    <editor-content
      :editor="editor"
      class="editor-content"
      :class="{focus: editor.view.focused && editable}"
    />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions';

export default {
  name: 'Editor',
  components: {
    EditorContent,
    EditorMenuBar,
  },
  props: ['content', 'editable', 'displayMenu'],
  data() {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
        ],
        content: this.content,
        editable: this.editable,
        onUpdate: (event) => {
          const html = event.getHTML();
          // emit 'input' so v-model can be used in parent component
          this.$emit('input', html);
        },
      }),
    };
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  watch: {
    editable() {
      // toggle editor editablity (is that a word?)
      this.editor.setOptions({
        editable: this.editable,
      });
      // sets content back to what it was if cancelled
      this.editor.setContent(this.content);
      // make editor focus automatically after becoming editable
      this.editor.focus('end');
    },
  },
};
</script>

<style>
  .editor {
    padding: 5px 15px 15px;
  }
  .menubar {
    padding: 10px 5px;
    border-bottom: 1px solid #ddd;
  }
  .menubar-button {
    background: none;
    border: none;
    padding: 0 10px;
  }
  .editor-content > div {
    padding: 12.5px 15px;
    min-height: 200px;
  }
  .editor-content.focus > div {
    box-shadow: 0 0 2px 2px var(--primary-color);
    border-radius: 5px;
  }
  .editor-content > div:focus {
    outline: none;
  }
  .editor-content * {
    margin: 0;
    line-height: 1.25;
  }
  .editor-content hr {
    margin: 10px 0;
  }
</style>
