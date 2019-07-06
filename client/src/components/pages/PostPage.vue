<template>
  <div id="page">
    <div class="container">
      <modal />
      <Post />
      <div class="comment-controls">
        <nav :class="{ shadow: isCreatingComment }" class="secondary-nav">
          <span class="brand">Comments</span>
          <button
            class="btn green border sm"
            v-if="token && !isCreatingComment"
            v-on:click="toggleCreatingComment"
          >
            New Comment
          </button>
          <select @change="handleChange">
            <option
              :selected="sort === '-updatedAt'"
              value="-updatedAt"
            >
              Date Updated (Newest - Oldest)
            </option>
            <option
              :selected="sort === '-createdAt'"
              value="-createdAt"
            >
              Date Created (Newest - Oldest)
            </option>
            <option
              :selected="sort === '-likesCount'"
              value="-likesCount"
            >
              Most Liked
            </option>
          </select>
        </nav>
        <div v-if="isCreatingComment" class="form">
          <text-area
            :value="commentFormBody"
            v-on:input="setCommentFormBody"
            placeholder="Comment goes here..."
          />
          <div class="btn-group">
            <button
              class="btn blue border sm"
              v-if="token && isCreatingComment"
              v-on:click="toggleCreatingComment"
            >
              Cancel
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
          </div>
        </div>
      </div>
      <PostComments :comments="comments" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import PostComments from '../posts/PostComments';
import Post from '../posts/Post';
import FormInput from '../reusable/forms/FormInput';
import Modal from '../reusable/Modal';
import TextArea from '../reusable/forms/TextArea';
import Spinner from '../Spinner';

export default {
  name: 'PostPage',
  components: {
    Post,
    PostComments,
    FormInput,
    Modal,
    TextArea,
    Spinner,
  },
  data() {
    return {
      sort: '-createdAt',
    };
  },
  mounted() {
    this.getPostComments({ postId: this.$route.params.postId });
    this.scroll();
  },
  beforeDestroy() {
    this.resetPost();
    this.hideModal();
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
    ...mapGetters(['isCreatingComment', 'commentFormBody', 'isSavingComment', 'token', 'comments']),
  },
  methods: {
    ...mapActions(['resetPost', 'createComment', 'getPostComments']),
    ...mapMutations([
      'toggleCreatingComment',
      'setCommentFormBody',
      'setCommentSaved',
      'setError',
      'hideModal',
      'setCommentsNextPage',
      'setCommentsPage',
      'clearCommentsList',
    ]),
    handleChange(event) {
      this.clearCommentsList();
      this.setCommentsPage(0);
      this.setCommentsNextPage(true);
      this.getPostComments({ postId: this.$route.params.postId, sort: event.target.value });
      this.sort = event.target.value;
    },
    scroll() {
      const page = document.getElementById('page');
      page.onscroll = () => {
        const { clientHeight, scrollTop, scrollHeight } = page;
        const bottomOfWindow = (clientHeight * 1.25) + scrollTop >= scrollHeight;

        // if user is a quarter of the screen's height away from the bottom of the page
        if (bottomOfWindow) {
          // get next page of posts
          this.getPostComments({ postId: this.$route.params.postId, sort: this.sort });
        }
      };
    },
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
