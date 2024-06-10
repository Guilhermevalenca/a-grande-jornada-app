<template>
  <section>
    <h1>ola</h1>
    <CreatePosts/>
  </section>
</template>
<script lang="ts">

import {defineAsyncComponent, defineComponent} from 'vue';

export default defineComponent({
  name: 'PostsPage',
  components: {
    CreatePosts: defineAsyncComponent (
      ()=> import('components/posts/CreatePosts.vue'),
    ),
  },
});

</script>
<style scoped>

</style>
