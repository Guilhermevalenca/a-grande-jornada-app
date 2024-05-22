<template>
<div>
  <q-list bordered class="rounded-borders">
    <q-expansion-item
      v-for="(form, index) in formStore.getForms" :key="index"
      expand-separator
      :label="form.title"
      icon="mdi-form-dropdown"
      :caption="`Formulário ${index + 1}`"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">Questões:</div>
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
            />
          </q-list>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</div>
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
    const formStore = useFormsStore();

    return {
      formStore,
    }
  },

  methods: {
    async allForms() {
      await this.$api.get('api/form')
        .then(response => {
          this.formStore.setForms(response.data);
        })
        .catch(error => {
          console.log(error);
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
