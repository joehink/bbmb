<template>
  <div id="page">
    <div class="content">
      <img src="/static/images/categories/tour.png" height="200px" alt="Authorization is required">
      <h2 class="message">{{ message || 'You must be logged in to view this page.' }}</h2>
      <div class="btn-group">
        <router-link to="/signup" class="btn blue border">Sign Up</router-link>
        <router-link to="/login" class="btn blue">Log In</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthRequired',
  props: ['message'],
};
</script>

<style scoped>
  #page {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content {
    text-align: center;
    background: var(--white);
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    padding: 50px;
    border-radius: 15px;
  }
  .message {
    margin: 25px 0;
  }
  .btn-group {
    justify-content: center;
  }
  .btn:first-child {
    margin-right: 5px;
  }
</style>
