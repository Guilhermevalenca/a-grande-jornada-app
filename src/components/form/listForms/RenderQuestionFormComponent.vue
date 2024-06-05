<template>
  <q-expansion-item
    v-model="showQuestion"
    :class="[
      'q-mb-xs shadow-transition shadow-3',
      showQuestion ? (index !== 0 ? 'shadow-up-24' : 'shadow-5') : '',
    ]"
    :duration="500"
  >
    <template #header>
      <div class="full-width">
        <strong>{{ index + 1 }}) </strong>
        <span v-html="question.title"></span>
      </div>
    </template>
    <q-card>
      <q-card-section>
        <div class="flex justify-end q-mb-md">
          <q-btn
            icon="mdi-pencil"
            color="secondary"
            class="q-mr-xs"
            rounded
            @click="editQuestion = true"
            >Editar</q-btn
          >
          <q-btn
            icon="mdi-delete"
            color="negative"
            rounded
            @click="showDialog.delete = true"
            >Deletar</q-btn
          >
        </div>
        <q-list bordered class="rounded-borders">
          <RenderOption
            v-for="(option, indexO) in question.options"
            :key="indexO"
            :option="option"
            :index="indexO"
          />
        </q-list>
      </q-card-section>
    </q-card>
  </q-expansion-item>
  <q-dialog v-model="editQuestion" full-height full-width persistent>
    <EditQuestion
      :question="question"
      @allForms="$emit('allForms')"
      @closeEdit="editQuestion = false"
    />
  </q-dialog>
  <q-dialog v-model="showDialog.delete">
    <q-card class="q-pb-sm">
      <q-card-section>
        <div class="flex justify-end">
          <q-btn icon="close" flat v-close-popup />
        </div>
        <div class="text-h6 text-center">Tem certeza?</div>
      </q-card-section>
      <q-card-section>
        <div>
          A questão: <strong>"{{ question.title }}"</strong> será deletada
          permanentemente, ocasionando também a perda de suas Alternativas.
        </div>
      </q-card-section>
      <q-card-actions class="flex justify-center">
        <q-btn color="negative" push @click="deleteQuestion">Apagar!</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, PropType } from 'vue';
import { IQuestion } from 'stores/useFormsStore';

export default defineComponent({
  name: 'RenderQuestionFormComponent',

  components: {
    RenderOption: defineAsyncComponent(
      () => import('components/form/listForms/RenderOptionFormComponent.vue')
    ),
    EditQuestion: defineAsyncComponent(
      () => import('components/form/editForm/EditQuestionFormComponent.vue')
    ),
  },

  props: {
    question: {
      type: Object as PropType<IQuestion>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },

  emits: ['deleteQuestion', 'allForms'],

  data() {
    const disable = false;
    const showDialog = {
      update: false,
      delete: false,
    };
    const showQuestion = false;
    const editQuestion = false;

    return {
      disable,
      showDialog,
      showQuestion,
      editQuestion,
    };
  },

  methods: {
    async deleteQuestion() {
      this.disable = true;
      await this.$api
        .delete(`api/form/question/${this.question.id}`)
        .then((response) => {
          if (response.data) {
            this.$emit('deleteQuestion');
            this.showDialog.delete = false;
            this.showQuestion = false;
            this.$q.notify({
              message: 'Questão deletada com sucesso',
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
            });
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.disable = false;
        });
    },
  },
});
</script>

<style scoped></style>
