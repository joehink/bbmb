<template>
  <div class="dropdown-container">
    <font-awesome-icon
      icon="ellipsis-v"
      class="dropdown-button"
      v-on:click="showMenu = true"
      ref="dropdown-button"
    />
    <ul
      class="dropdown-menu"
      v-if="showMenu"
      v-on:click="showMenu = false"
      v-closable="{
        exclude: ['dropdown-button'],
        handler: 'closeMenu'
      }"
    >
      <li
        class="dropdown-menu-item"
        v-for="control in filteredControls"
        :key="control.text"
        v-on:click="control.action"
      >
        {{ control.text }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DropDownMenu',
  props: ['controls', 'index'],
  data() {
    return {
      showMenu: false,
    };
  },
  computed: {
    filteredControls() {
      return this.controls.filter(control => control.show);
    },
  },
  methods: {
    closeMenu() {
      this.showMenu = false;
    },
  },
};
</script>

<style scoped>
  .dropdown-container {
    position: relative;
  }
  .dropdown-button {
    cursor: pointer;
  }
  .dropdown-menu {
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
    background: white;
    position: absolute;
    list-style-type: none;
    padding: 0;
    margin: 0;
    border: 1px solid var(--primary-color);
    border-radius: 5px;
    line-height: 1.5;
    min-width: 100px;
    transform: translateX(-92.5%);
  }
  .dropdown-menu-item:first-child {
    padding: 2.5px 10px 0;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .dropdown-menu-item:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .dropdown-menu-item {
    padding: 0 10px;
    cursor: pointer;
    text-align: center;
    outline: none;
  }
  .dropdown-menu-item:hover {
    background: #ddd;
  }
</style>
