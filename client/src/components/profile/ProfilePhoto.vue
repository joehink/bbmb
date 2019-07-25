<template>
  <div class="profile-img"></div>
</template>

<script>
export default {
  name: 'ProfilePhoto',
};
</script>

<style scoped>
  .profile-img {
    border-radius: 100%;
    background-size: cover;
    background-position: center;
    background: var(--white);
  }
  .profile-img-sm {
    width: 40px;
    height: 40px;
    border: 2px solid var(--white);
  }
  .profile-img-md {
    width: 50px;
    height: 50px;
    border: 2px solid var(--white);
  }
  .profile-img-lg {
    width: 200px;
    height: 200px;
    border: 5px solid var(--white);
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
  }
</style>
