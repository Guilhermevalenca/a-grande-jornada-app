<template>
  <q-card>
    <q-card-section class="text-center text-h6">
      Editando Questão
    </q-card-section>
    <q-card-section>
      <q-editor
        v-model="editQuestion.title"
        :disable="disable"
      />
      <q-card>
        <q-card-section>
          <EditOption
            v-for="(option, index) in editQuestion.options" :key="index"
            v-model:option="editQuestion.options[index]"
            @removeOption="removeOption(Number(index))"
            :disable="disable"
          />
        </q-card-section>
        <q-card-section class="flex justify-end">
          <q-btn
            icon="mdi-plus"
            color="primary"
            round
            @click="addOption"
          >
            <q-tooltip class="text-h6">
              Adicionar nova opção
            </q-tooltip>
          </q-btn>
        </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section class="flex justify-center">
      <q-btn
        color="primary"
        class="q-mr-xs"
        push
        :disable="disable"
        :loading="disable"
        @click="updateQuestion"
      >Editar</q-btn>
      <q-btn
        v-close-popup
        :disable="disable"
      >Cancelar</q-btn>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, PropType } from 'vue';
import { IQuestion } from 'stores/useFormsStore';

export default defineComponent({
  name: 'EditQuestionFormComponent',

  components: {
    EditOption: defineAsyncComponent(() => import('components/form/editForm/EditOptionFormComponent.vue'))
  },

  props: {
    question: {
      type: Object as PropType<IQuestion>,
      required: true
    }
  },

  emits: ['allForms', 'closeEdit'],

  data() {
    const editQuestion = {
      ...this.question
    };
    const disable = false;

    return {
      editQuestion,
      disable
    }
  },

  methods: {
    removeOption(index: number) {
      this.editQuestion.options.splice(index, 1);
    },
    addOption() {
      this.editQuestion.options.push({
        title: '',
        isOpen: false,
        correctAlternative: false
      });
    },
    async updateQuestion() {
      this.disable = true;
      const notify = this.$q.notify({
        message: 'Editando...',
        timeout: 0,
        spinner: true,
        spinnerSize: 'xl',
        group: false,
      });
      await this.$api.put(`api/form/question/${this.editQuestion.id}`, this.editQuestion)
        .then(response => {
          if(response.data) {
            notify({
              message: 'Editado com sucesso!!!',
              color: 'green-4',
              timeout: 2000,
              icon: 'cloud_done',
              spinner: false,
            });
            this.$emit('allForms');
            this.$emit('closeEdit');
          } else {
            notify({
              message: 'Não foi possivel editar está questão, por favor tente novamente mais tarde.',
              color: 'red-5',
              icon: 'warning',
              timeout: 2000,
              spinner: false
            });
          }
        })
        .catch(error => {
          notify({
            message: 'Não foi possivel editar está questão, por favor tente novamente mais tarde.',
            color: 'red-5',
            icon: 'warning',
            timeout: 2000,
            spinner: false
          });
          console.log(error);
        })
        .finally(() => {
          this.disable = false;
        })
    }
  },

  mounted() {
    console.log(this.editQuestion);
  }
});
</script>

<style scoped>

</style>
