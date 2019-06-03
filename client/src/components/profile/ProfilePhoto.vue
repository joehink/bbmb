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
</style>
