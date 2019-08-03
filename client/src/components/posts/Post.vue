<template>
  <div>
    <Notification message="Post changes were successfully saved." v-if="isPostSaved" />
    <error-message />
    <div class="post" v-if="post">
      <div class="post-header" v-if="post">
        <div class="likes-username-date">
          <div v-on:click="likePost(anim)">
            <lottie
              :options="defaultOptions"
              :height="25"
              :width="25"
              v-on:animCreated="handleAnimation"
              class="sun"
            />
          </div>
          <span class="like-count">{{ post.likesCount }}</span>
          <router-link class="user-link username" :to="`/users/${post.author._id}`">
            {{ post.author.username }}
          </router-link>
          <span class="date">{{ date }}</span>
          <div class="post-controls">
            <drop-down-menu
              v-if="user && user._id === post.author._id"
              class="control-menu"
              :controls="[{
                text: 'Edit',
                action: toggleEdit,
                show: user && user._id === post.author._id && !isSavingPost,
              }, {
                text: 'Delete',
                action: () => {
                  this.displayModal({
                    message: 'Are you sure you want to delete this post?',
                    btnText: 'Delete',
                    btnColor: 'red',
                    action: () => deletePost(this.post._id),
                  });
                },
                show: user && user._id === post.author._id && !isPostEditable,
              }]"
            />
          </div>
        </div>
        <h3>{{ post.title }}</h3>
      </div>
      <div class="edit-form">
        <div class="form-row" v-if="isPostEditable">
          <label for="title">Title:</label>
          <form-input id="title" :value="postFormTitle" v-on:input="setPostFormTitle" />
        </div>
        <div class="form-row">
          <label for="body" v-if="isPostEditable">Body:</label>
          <editor
            :content="postFormBody"
            :editable="isPostEditable"
            :displayMenu="displayEditorMenu"
            v-on:input="setPostFormBody"
          />
        </div>
        <div class="form-row btn-group">
          <button
            class="btn border blue sm"
            v-if="isPostEditable"
            v-on:click="toggleEdit"
          >
            Cancel
          </button>
          <button
            v-if="isPostEditable"
            v-on:click="updatePost"
            class="btn border green sm"
            :disabled="!isPostContentChanged || isSavingPost"
          >
            <Spinner class="btn-spinner green" v-if="isSavingPost" />
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Lottie from 'vue-lottie';
import moment from 'moment';
import animationData from '../../../static/images/sun.json';
import DropDownMenu from '../reusable/DropDownMenu';
import Editor from '../reusable/Editor';
import ErrorMessage from '../reusable/errors/ErrorMessage';
import FormInput from '../reusable/forms/FormInput';
import Notification from '../reusable/Notification';
import Spinner from '../Spinner';

export default {
  name: 'Post',
  components: {
    DropDownMenu,
    Editor,
    ErrorMessage,
    FormInput,
    Notification,
    Spinner,
    Lottie,
  },
  data() {
    return {
      defaultOptions: {
        animationData,
        loop: false,
        autoplay: false,
      },
    };
  },
  mounted() {
    this.getPost(this.$route.params.postId);
  },
  beforeDestroy() {
    // Remove error message when user navigates away from form
    this.setError('');
  },
  watch: {
    postFormBody() {
      this.setPostContentChanged(true);
      this.setPostSaved(false);
      this.setError('');
    },
    postFormTitle() {
      this.setPostContentChanged(true);
      this.setPostSaved(false);
      this.setError('');
    },
    isPostEditable(newVal) {
      this.setPostContentChanged(false);
      if (!newVal) {
        this.setPostFormBody(this.post.body);
        this.setPostFormTitle(this.post.title);
      }
    },
  },
  computed: {
    ...mapGetters([
      'isLoggedIn',
      'token',
      'user',
      'post',
      'postFormTitle',
      'postFormBody',
      'isSavingPost',
      'isPostSaved',
      'isPostEditable',
      'isLikingPost',
      'isPostContentChanged',
    ]),
    date() {
      // format date posted using moment
      return moment(this.post.createdAt).format('MMMM D, YYYY');
    },
    displayEditorMenu() {
      // determine whether or not the editor menubar should be displayed
      return this.user && this.post.author._id === this.user._id && this.isPostEditable;
    },
  },
  methods: {
    ...mapActions(['getPost', 'likePost', 'updatePost', 'deletePost', 'displayModal']),
    ...mapMutations([
      'setError',
      'setPostEditable',
      'setPostSaved',
      'setPostContentChanged',
      'setPostFormTitle',
      'setPostFormBody',
    ]),
    handleAnimation(anim) {
      this.anim = anim;
    },
    toggleEdit() {
      this.setPostEditable(!this.isPostEditable);
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
  }
  .post-header {
    padding-bottom: 10px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    padding: 12.5px 25px;
  }
  .likes-username-date{
    display: flex;
    align-items: center;
    margin-left: -5px;
    margin-bottom: 7.5px;
  }
  .username {
    background: #ddd;
    border-radius: 20px;
    display: inline-block;
    padding: 2.5px 10px;
    font-size: .8em;
    text-overflow: ellipsis;
    max-width: 80px;
    white-space: nowrap;
    overflow: hidden;
    margin-left: 7.5px;
  }
  .post-controls {
    margin-left: auto;
  }
  .sun {
    cursor: pointer;
  }
  .date {
    color: #aaa;
    font-size: .9em;
    margin: 0 0 0 7.5px;
  }
  .edit-form {
    padding: 25px;
  }
  .form-row:first-of-type {
    margin-bottom: 25px;
  }
  .btn-group > *:first-child {
    margin-right: 5px;
  }

  @media(min-width: 768px) {
    .username {
      max-width: unset;
    }
  }
</style>
