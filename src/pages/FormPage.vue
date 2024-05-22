<template>
  <q-breadcrumbs class="column col-11 q-mt-md q-mb-sm">
    <q-breadcrumbs-el label="Formulário" icon="mdi-home"/>
    <q-breadcrumbs-el :label="page === 'create' ? 'Criando Formulário' : 'Seus Formulário'"/>
    <q-breadcrumbs-el
      v-for="(label, index) in otherPages" :key="index"
      :label="label"
    />
  </q-breadcrumbs>
  <q-card class="column col-11">
    <q-card-actions class="flex justify-end">
      <q-btn @click="page = 'index'" push>Ver formulários</q-btn>
      <q-btn color="primary" @click="page = 'create'" push>Criar formulários</q-btn>
    </q-card-actions>
    <q-card-section>
      <q-tab-panels v-model="page">
        <q-tab-panel name="index">
          <ListForms />
        </q-tab-panel>
        <q-tab-panel name="create">
          <CreateForm
            @toListForm="page = 'index'"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';

export default defineComponent({
  name: 'FormPage',

  components: {
    ListForms: defineAsyncComponent(() => import('components/form/ListFormsComponent.vue')),
    CreateForm: defineAsyncComponent(() => import('components/form/CreateFormComponent.vue'))
  },

  data() {
    const page = 'index';
    const otherPages: string[] = [];

    return {
      page,
      otherPages
    }
  }
});
</script>

<style scoped>

</style>
