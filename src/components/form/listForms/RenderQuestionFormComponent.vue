<template>
  <q-expansion-item
    :label="`${index + 1}) ${question.title}`"
    :disable="disable"
  >
    <q-card>
      <q-card-section class="flex justify-between">
        <div class="text-h6">Alternativas:</div>
        <div>
          <q-btn
            icon="mdi-pencil"
            rounded
            color="secondary"
            class="q-mr-xs"
            size="sm"
          >
            <q-tooltip>
              <div class="text-h6">
                Editar Questão
              </div>
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="mdi-delete"
            rounded
            color="negative"
            size="sm"
            @click="showDialog.delete = true"
          >
            <q-tooltip>
              <div class="text-h6">
                Deletar Questão
              </div>
            </q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
      <q-card-section>
        <q-list bordered class="rounded-borders">
          <RenderOption
            v-for="(option, indexO) in question.options" :key="indexO"
            :option="option"
            :index="indexO"
            @deleteOption="$emit('deleteOption', indexO)"
          />
        </q-list>
      </q-card-section>
    </q-card>
  </q-expansion-item>
  <q-dialog v-model="showDialog.delete">
    <q-card class="q-pb-sm">
      <q-card-section>
        <div class="flex justify-end">
          <q-btn icon="close" flat v-close-popup />
        </div>
        <div class="text-h6 text-center">Tem certeza?</div>
      </q-card-section>
      <q-card-section>
        <div>A questão: <strong>"{{question.title}}"</strong> será deletada permanentemente, ocasionando também a perda de suas Alternativas.</div>
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
    RenderOption: defineAsyncComponent(() => import('components/form/listForms/RenderOptionFormComponent.vue'))
  },

  props: {
    question: {
      type: Object as PropType<IQuestion>,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },

  emits: ['deleteQuestion', 'deleteOption'],

  data() {
    const disable = false;
    const showDialog = {
      update: false,
      delete: false,
    }

    return {
      disable,
      showDialog
    }
  },

  methods: {
    async deleteQuestion() {
      this.disable = true;
      await this.$api.delete(`api/form/question/${this.question.id}`)
        .then(response => {
          if(response.data) {
            this.$emit('deleteQuestion');
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.disable = false;
        });
    }
  }
});
</script>

<style scoped>

</style>
