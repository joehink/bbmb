<template>
  <div class="select-container">
    <select @change="onSelect">
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
  padding: 2.5px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
select {
  outline: none;
  background: none;
  border: none;
  color: var(--primary-color);
  padding: 0;
  margin: 0;
}
</style>
