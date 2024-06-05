<template>
  <q-card class="col-11 my-6">
    <q-card-section class="flex justify-between">
      <div class="text-h6">Deletar conta</div>
      <div>
        <q-icon name="mdi-help" size="md">
          <q-tooltip class="text-h6">
            Deletar sua conta é um efeito permanente e você não poderá
            recupera-la
          </q-tooltip>
        </q-icon>
      </div>
    </q-card-section>
    <q-card-section class="border">
      Depois que sua conta for excluida, todos os seus dados serão excluidos
      permanetemente. Antes de escluir sua conta, certifique-se que é isso que
      você deseja!
    </q-card-section>
    <q-card-actions>
      <q-btn color="negative" push> Deletar Conta </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DeleteAccount',

  data() {
    const loading = false;

    return {
      loading
    }
  }
});
</script>

<style scoped>

</style>
