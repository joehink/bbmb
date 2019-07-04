<template>
  <div id="page">
    <div class="content">
      <img src="/static/images/categories/tour.png" height="200px" alt="Authorization is required">
      <h2 class="message">You must be logged in to perform this action</h2>
      <div>
        <a class="btn blue border" href="/signup">Sign Up</a>
        <a class="btn blue" href="/login">Log In</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthRequired',
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
</style>
