<template>
  <div class="select-container">
    <select @change="onSelect">
      <option
        :selected="sort === '-lastCommentAt'"
        value="-lastCommentAt"
      >
        Recently Commented On
      </option>
      <option
        :selected="sort === '-createdAt'"
        value="-createdAt"
      >
        Most Recent
      </option>
      <option
        :selected="sort === '-likesCount'"
        value="-likesCount"
      >
        Most Liked
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'SelectBox',
  props: ['sort'],
  methods: {
    onSelect(event) {
      this.$emit('change', event);
    },
  },
};
</script>

<style scoped>
.select-container {
  border: 2px solid var(--primary-color);
  border-radius: 25px;
  padding: 2.5px 15px;
  overflow: hidden;
  text-align: center;
}
select {
  outline: none;
  background: none;
  border: none;
  color: var(--primary-color);
  padding: 0;
  margin: 0;
  text-align: center;
}
</style>
