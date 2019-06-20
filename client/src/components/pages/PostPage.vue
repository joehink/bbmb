<template>
  <div class="container">
    <Post />
    <div class="comment-controls">
      <nav :class="{ shadow: isCreatingComment }" class="secondary-nav">
        <span class="brand">Comments</span>
        <button
          class="btn blue border sm"
          v-if="token && isCreatingComment"
          v-on:click="toggleCreatingComment"
        >
          Cancel
        </button>
        <button
          class="btn green border sm"
          v-if="token && !isCreatingComment"
          v-on:click="toggleCreatingComment"
        >
          New Comment
        </button>
        <button
          class="btn green border sm"
          v-if="token && isCreatingComment"
          v-on:click="createComment"
          :disabled="isSavingComment"
        >
          <Spinner class="btn-spinner green" v-if="isSavingComment" />
          Add Comment
        </button>
      </nav>
      <div v-if="isCreatingComment" class="form">
        <text-area
          :value="commentFormBody"
          v-on:input="setCommentFormBody"
          placeholder="Comment goes here..."
        />
      </div>
    </div>
    <PostComments />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import PostComments from '../posts/PostComments';
import Post from '../posts/Post';
import FormInput from '../reusable/forms/FormInput';
import TextArea from '../reusable/forms/TextArea';
import Spinner from '../Spinner';

export default {
  name: 'PostPage',
  components: {
    Post,
    PostComments,
    FormInput,
    TextArea,
    Spinner,
  },
  beforeDestroy() {
    this.resetPost();
  },
  watch: {
    isCreatingComment() {
      this.setCommentFormBody('');
      this.setError('');
    },
    commentFormBody() {
      this.setCommentSaved(false);
    },
  },
  computed: {
    ...mapGetters(['isCreatingComment', 'commentFormBody', 'isSavingComment', 'isCommentSaved', 'token']),
  },
  methods: {
    ...mapActions(['resetPost', 'createComment']),
    ...mapMutations(['toggleCreatingComment', 'setCommentFormBody', 'setCommentSaved', 'setError']),
  },
};
</script>


<style scoped>
  .comment-controls {
    background: white;
    border-radius: 15px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    margin-top: 40px;
  }
  .secondary-nav {
    margin: 0;
    border: none;
    box-shadow: none;
  }
  .secondary-nav.shadow {
    margin: 0;
    border: none;
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .secondary-nav .btn:last-of-type {
    margin-left: 5px;
  }
  .form {
    padding: 25px;
  }
</style>
