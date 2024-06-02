<template>
  <q-item-label
    class="flex items-center"
  >
    <strong>{{index + 1}}) </strong>
    <span class="q-ml-xs"> {{ form.title }}</span>
  </q-item-label>
  <q-item-section class="flex items-end">
    <q-icon
      name="mdi-eye-outline"
      flat
      size="sm"
    />
  </q-item-section>
  <q-dialog
    v-model="getShowQuestions"
    backdrop-filter="blur(4px) grayscale(70%)"
    full-width
    full-height
    transition-duration="400"
  >
    <q-card>
      <q-card-actions class="row justify-between">
        <div
          class="q-ml-md flex items-center"
          @dblclick="showEditForm = true"
          v-if="!showEditForm"
        >
          <span class="text-h6">{{form.title}}</span>
          <q-btn
            color="negative"
            @click="showDialogDelete = true"
            icon="mdi-delete"
            flat
          >
            <q-tooltip class="text-h6">
              Deletar formulário
            </q-tooltip>
          </q-btn>
        </div>
        <div v-else class="col-10 q-ml-md text-h6 flex items-center">
          <q-form class="full-width" @submit.prevent="updateForm">
            <q-input
              v-model="editForm.title"
            >
              <template #append>
                <q-btn
                  icon="mdi-content-save-outline"
                  size="sm"
                  color="primary"
                  class="q-mr-md"
                  round
                >
                  <q-tooltip class="text-h6">Salvar</q-tooltip>
                </q-btn>
                <q-icon
                  name="close"
                  size="sm"
                  @click="showEditForm = false; editForm.title = form.title"
                >
                  <q-tooltip class="text-h6">Cancelar</q-tooltip>
                </q-icon>
              </template>
            </q-input>
          </q-form>
        </div>
        <div class="flex items-center">
          <q-icon name="mdi-help" size="xs">
            <q-tooltip class="text-h6">
              Para editar o titulo dé dois click no titulo!
            </q-tooltip>
          </q-icon>
          <q-btn icon="close" flat v-close-popup />
        </div>
      </q-card-actions>

      <q-card-section class="scroll" style="height: 90%;">
        <q-list
          bordered
          class="rounded-borders"
          v-show="!loadingUpdateTitle"
        >
          <RenderQuestion
            v-for="(question, indexQ) in form.questions" :key="indexQ"
            :question="question"
            :index="indexQ"
            @deleteQuestion="formsStore.deleteQuestion(index, indexQ)"
            @allForms="$emit('allForms')"
          />
        </q-list>
      </q-card-section>
      <q-inner-loading
        :showing="loadingUpdateTitle"
        label="Carregando..."
      />
    </q-card>
  </q-dialog>
  <q-dialog v-model="showDialogDelete">
    <q-card class="q-pr-sm q-pl-sm q-pb-sm">
      <q-card-section>
        <div class="flex justify-end">
          <q-btn icon="close" flat v-close-popup
                 :disable="loading"
          />
        </div>
        <div class="text-h6 text-center">Tem certeza?</div>
      </q-card-section>
      <q-card-section>
        <div>Ao deletar o formulário: "<strong>{{form.title}}</strong>" todas as questões e suas alternativas serão perdidos.</div>
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
</template>


<script lang="ts">
import { defineAsyncComponent, defineComponent, PropType } from 'vue';
import useFormsStore, { IForm } from 'stores/useFormsStore';

export default defineComponent({
  name: 'RenderFormComponent',

  components: {
    RenderQuestion: defineAsyncComponent(() => import('components/form/listForms/RenderQuestionFormComponent.vue'))
  },

  emits: ['deleteForm', 'deleteQuestion', 'deleteOption', 'update:showQuestions', 'allForms'],

  props: {
    form: {
      type: Object as PropType<IForm>,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    showQuestions: {
      type: Boolean,
    }
  },

  data() {
    const formsStore = useFormsStore();
    const options = false;
    const showEditForm = false;
    const editForm = {
      title: this.form.title
    }
    const loading = false;
    const showDialogDelete = false;
    const loadingUpdateTitle = false;

    return {
      options,
      formsStore,
      showEditForm,
      editForm,
      loading,
      showDialogDelete,
      loadingUpdateTitle
    }
  },

  computed: {
    getShowQuestions: {
      get(): boolean {
        return this.showQuestions;
      },
      set($value: boolean) {
        this.$emit('update:showQuestions', $value);
      }
    }
  },

  methods: {
    async deleteForm() {
      this.loading = true;
      await this.$api.delete(`api/form/${this.form.id}`)
        .then(response => {
          if(response.data) {
            this.formsStore.deleteForm(Number(this.form.id));
            this.$emit('allForms');
            this.getShowQuestions = false;
            this.$q.notify({
              message: 'Formulário deletado com sucesso',
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
            });
          }
        })
        .catch(error => {
          console.log(error);
          this.$q.notify({
            message: 'Não foi possivel deletar seu formulário',
            color: 'red-5',
            textColor: 'white',
            icon: 'warning'
          })
        })
        .finally(() => {
          this.loading = false;
          this.showDialogDelete = false;
        })
    },
    async updateForm() {
      this.loadingUpdateTitle = true;
      await this.$api.patch(`api/form/${this.form.id}`, this.editForm)
        .then(response => {
          if(response.data) {
            this.$emit('allForms');
            this.$q.notify({
              message: 'Titulo editado com sucesso',
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              position: 'top'
            });
          }
        })
        .catch(error => console.log(error))
        .finally(() => {
          this.loadingUpdateTitle = false;
          this.showEditForm = false;
        })
    }
  }
});
</script>

<style scoped>

</style>
