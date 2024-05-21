<template>
  <q-form @submit.prevent="submit">
    <q-input
      v-model="form.title"
      label="Titulo do seu formulário"
      placeholder="Escreve o titulo que você desejar para o seu formulário"
      maxlength="255"
      counter
      outlined
      :loading="loading"
      :rules="rules"
      :readonly="loading"
    >
      <template #append>
        <q-btn icon="mdi-help" rounded>
          <q-tooltip>
            <div class="text-h6">O nome do formulário é importante para indentifica-lo</div>
          </q-tooltip>
        </q-btn>
      </template>
    </q-input>
    <br>
    <q-card v-for="(question, index) in form.questions" :key="index" class="q-mb-md">
      <q-card-actions class="flex justify-between">
        <div class="text-h6">Questão {{index + 1}}</div>
        <q-btn
          icon="mdi-minus"
          rounded push
          color="negative"
          v-if="Number(index) !== 0 || form.questions.length > 1"
          @click="removeQuestion(Number(index))"
          :disable="loading"
        >
          <q-tooltip>
            <div class="text-h6">Apagar questão</div>
            <p>Cuidado! Essa questão não poderá ser recuperada</p>
          </q-tooltip>
        </q-btn>
      </q-card-actions>
      <q-card-section>
        <QuestionForm
          v-model:title="question.title"
          v-model:options="question.options"
          :disable="loading"
        />
      </q-card-section>
    </q-card>
    <br>
    <div class="flex justify-end q-mt-sm">
      <q-btn
        icon="mdi-plus"
        rounded push
        color="primary"
        @click="addQuestion"
        :disable="loading"
      >
        <q-tooltip>
          <div class="text-h6 text-no-wrap">Adicionar nova questão</div>
        </q-tooltip>
      </q-btn>
    </div>
    <div class="flex justify-center">
      <q-btn
        type="submit"
        color="primary"
        rounded push
        size="lg"
        :loading="loading"
      >Criar Formulário</q-btn>
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import { IForm } from 'stores/useFormsStore';

export default defineComponent({
  name: 'CreateFormComponent',

  components: {
    QuestionForm: defineAsyncComponent(() => import('components/form/createForm/QuestionFormComponent.vue'))
  },

  data() {
    const form: IForm = {
      title: '',
      questions: [
        {
          title: '',
          options: [
            {
              title: '',
              isOpen: false,
              correctAlternative: false
            }
          ]
        }
      ]
    }
    const loading = false;
    const rules = [
      (value: string): string | boolean => {
        return value ? !!value : 'É necessário adicionar um titulo';
      }
    ]

    return {
      form,
      loading,
      rules
    }
  },

  methods: {
    addQuestion() {
      this.form.questions.push({
        title: '',
        options: [
          {
            title: '',
            isOpen: false,
            correctAlternative: false
          }
        ]
      });
    },
    removeQuestion(index: number) {
      this.form.questions.splice(index, 1);
    },
    async submit() {
      this.loading = true;
      await this.$api.post('api/form', this.form)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => this.loading = false);
    }
  }
});
</script>

<style scoped>

</style>
