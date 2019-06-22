<template>
  <div class="dropdown-container">
    <font-awesome-icon
      icon="ellipsis-v"
      v-on:click="toggleMenu"
    />
    <ul class="dropdown-menu" v-if="showMenu">
      <li>Edit</li>
      <li>Delete</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DropDownMenu',
  data() {
    return {
      showMenu: false,
    };
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
  },
};
</script>

<style scoped>
  .dropdown-container {
    display: relative;
  }
  .dropdown-menu {
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    background: white;
    position: absolute;
    list-style-type: none;
    padding: 7.5px 12.5px 5px;
    margin: 0;
    border: 1px solid var(--primary-color);
    border-radius: 5px;
    line-height: 1.5;
    min-width: 100px;
  }
</style>
