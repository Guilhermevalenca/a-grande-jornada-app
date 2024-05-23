<template>
  <q-item class="flex justify-between">
    <div>{{index + 1}} - {{option.title ? option.title : 'Opção aberta'}}</div>
    <div>
      <q-btn
        icon="mdi-pencil"
        color="secondary"
        size="xs"
        rounded
      >
        <q-tooltip>
          <div class="text-h6">Editar alternativa</div>
        </q-tooltip>
      </q-btn>
      <q-btn
        icon="mdi-delete"
        color="negative"
        size="xs"
        rounded
        @click="showDialogDelete = true"
      >
        <q-tooltip>
          <div class="text-h6">Deletar alternativa</div>
        </q-tooltip>
      </q-btn>
    </div>
  </q-item>
  <q-dialog v-model="showDialogDelete">
    <q-card>
      <q-card-section>
        <div class="flex justify-end">
          <q-btn
            icon="close"
            flat
            v-close-popup
            :disable="disable"
          />
        </div>
        <div class="text-h6">Tem certeza ?</div>
      </q-card-section>
      <q-card-section>
        <div>Essa ação irá apagar permanentemente este formulário</div>
      </q-card-section>
      <q-card-actions class="flex justify-end">
        <q-btn v-close-popup :disable="disable">cancelar</q-btn>
        <q-btn
          @click="deleteOption"
          :disable="disable"
          :loading="disable"
          color="negative"
        >Tenho certeza!</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IOption } from 'stores/useFormsStore';

export default defineComponent({
  name: 'RenderOptionFormComponent',

  props: {
    option: {
      type: Object as PropType<IOption>,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },

  emits: ['deleteOption'],

  data() {
    const showDialogDelete = false;
    const disable = false;

    return {
      showDialogDelete,
      disable
    }
  },

  methods: {
    async deleteOption() {
      this.disable = true;
      await this.$api.delete(`api/form/question/option/${this.option.id}`)
        .then(response => {
          if(response.data) {
            this.$emit('deleteOption');
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.disable = false;
          this.showDialogDelete = false;
        })
    }
  }
});
</script>

<style scoped>

</style>
