<template>
  <form>
    <input v-model="term" type="text" placeholder="Seach posts...">
    <button class="search-icon"><font-awesome-icon icon="search" /></button>
  </form>
</template>

<script>
export default {
  name: 'SearchInput',
  data() {
    return {
      term: '',
    };
  },
};
</script>

<style scoped>
  form {
    position: relative;
  }
  input {
    box-sizing: border-box;
    display: block;
    border-radius: 50px;
    margin: 10px 0;
    width: 100%;
    padding: 10px 20px;
    outline: none;
    background: #34578f;
    border: none;
    box-shadow: inset 0 3px 6px rgba(0,0,0,0.25);
  }
  input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  .search-icon {
    position: absolute;
    top: 50%;
    right: 15px;
    z-index: 2000;
    transform: translateY(-50%);
    background: none;
    border: none;
    outline: none;
    display: flex;
    align-items: center;
  }
</style>
