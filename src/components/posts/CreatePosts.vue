<template>
  <section>
    <q-card>
      <q-form>
        <div>
          <label for="titulo-da-aula">Titulo:</label>
          <input type="text" id="Titulo-da-aula" placeholder="titulo da aula">
        </div>
        <div>
          <label for="conteudo-da-aula">Conteúdo da aula:</label>
          <q-editor model-value="" id="conteudo-da-aula"/>
        </div>
        <div>
          <button type="submit"> Postar </button>
        </div>
      </q-form>
    </q-card>
  </section>
</template>
<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name:'CreatePosts',
});
</script>
