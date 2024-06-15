<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'PostsComponent'
})
</script>

<template>
  <q-card-section>
    <q-form>
      <label for="class-title">Titulo da aula</label>
      <input id="class-title" type="text" placeholder="titulo da aula">
      <label for="class-content">Conteúdo da aula</label>
      <q-editor id="class-content" model-value="" placeholder="conteúdo da aula"></q-editor>
    </q-form>
  </q-card-section>
</template>

<style scoped>

</style>
