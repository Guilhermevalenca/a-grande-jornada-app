<template>
  <q-list bordered class="rounded-borders">
    <q-expansion-item
      v-for="(form, index) in formsStore.getForms" :key="index"
      expand-separator
      :label="form.title"
      icon="mdi-form-dropdown"
      :caption="`Formulário ${index + 1}`"
    >
      <q-card>
        <q-card-section class="flex justify-between">
          <div class="text-h6">Questões:</div>
          <q-btn
            icon="mdi-delete"
            color="negative"
            push
            @click="showDialogDelete = true; idFormDelete = Number(form.id)"
            rounded
          />
        </q-card-section>
        <q-card-section>
          <q-list
            bordered
            class="rounded-borders"
          >
            <RenderQuestion
              v-for="(question, indexQ) in form.questions"
              :key="indexQ"
              :question="question"
              :index="indexQ"
              @deleteQuestion="formsStore.deleteQuestion(index, indexQ)"
              @deleteOption="indexO => formsStore.deleteOption(index, indexQ, indexO)"
            />
          </q-list>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
  <q-dialog v-model="showDialogDelete">
    <q-card class="q-pa-sm">
      <q-card-section>
        <div class="flex justify-end">
          <q-btn icon="close" flat v-close-popup
            :disable="loading"
          />
        </div>
        <div class="text-h6 text-center">Tem certeza?</div>
      </q-card-section>
      <q-card-section>
        <div>Se você deletar este formulário, todas as suas informações serão perdidas!!!</div>
      </q-card-section>
      <q-card-actions class="flex justify-end">
        <q-btn v-close-popup
          :disable="loading"
        >cancelar</q-btn>
        <q-btn
          color="negative"
          @click="deleteForm"
          :disable="loading"
          :loading="loading"
        >Tenho certeza</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="showDialogMessage.open">
    <q-card>
      <q-card-section>
        <div class="flex justify-end">
          <q-btn icon="close" flat v-close-popup />
        </div>
        <div class="text-h6 text-center">Notificação!</div>
      </q-card-section>
      <q-card-section>
        <div>{{showDialogMessage.text}}</div>
      </q-card-section>
      <q-card-actions class="flex justify-center">
        <q-btn v-close-popup push>OK</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import useFormsStore from 'stores/useFormsStore';

export default defineComponent({
  name: 'ListFormsComponent',

  components: {
    RenderQuestion: defineAsyncComponent(() => import('components/form/listForms/RenderQuestionFormComponent.vue'))
  },

  data() {
    const formsStore = useFormsStore();
    const openActions: boolean[] = [];
    const showDialogDelete = false;
    const showDialogMessage = {
      text: '',
      open: false
    }
    const idFormDelete = 0;
    const loading = false;

    return {
      formsStore,
      openActions,
      showDialogDelete,
      idFormDelete,
      loading,
      showDialogMessage
    }
  },

  methods: {
    async allForms() {
      await this.$api.get('api/form')
        .then(response => {
          this.formsStore.setForms(response.data);
        })
        .catch(error => {
          console.log(error);
        })
    },
    async deleteForm() {
      this.loading = true;
      await this.$api.delete(`api/form/${this.idFormDelete}`)
        .then(response => {
          if(response.data) {
            this.formsStore.deleteForm(this.idFormDelete);
            this.idFormDelete = 0;
            this.showDialogMessage = {
              open: true,
              text: 'Formulário apagado com sucesso'
            }
          }
        })
        .catch(error => {
          console.log(error);
          this.showDialogMessage = {
            open: true,
            text: 'Algo deu errado ao tentar apagar o formulário'
          }
        })
        .finally(() => {
          this.loading = false;
          this.showDialogDelete = false;
        })
    }
  },

  mounted() {
    this.allForms();
  }
});
</script>

<style scoped>

</style>
