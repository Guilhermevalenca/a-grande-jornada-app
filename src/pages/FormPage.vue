<template>
  <section class="col-11">
    <q-breadcrumbs class="q-mt-md q-mb-sm">
      <q-breadcrumbs-el label="Formulário" icon="mdi-home" />
      <q-breadcrumbs-el
        :label="page === 'create' ? 'Criando Formulário' : 'Seus Formulário'"
      />
      <q-breadcrumbs-el
        v-for="(label, index) in otherPages"
        :key="index"
        :label="label"
      />
    </q-breadcrumbs>
    <div class="flex justify-end q-mb-lg">
      <q-btn @click="page = 'index'" push>Ver formulários</q-btn>
      <q-btn color="primary" @click="page = 'create'" push
        >Criar formulários</q-btn
      >
    </div>
    <q-card
      :class="
        formsStore.forms.length === 0 && page !== 'create'
          ? 'window-height'
          : 'full-height'
      "
    >
      <q-card-section>
        <q-tab-panels v-model="page">
          <q-tab-panel name="index">
            <ListForms />
          </q-tab-panel>
          <q-tab-panel name="create">
            <CreateForm @toListForm="page = 'index'" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </section>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import useFormsStore from 'stores/useFormsStore';

export default defineComponent({
  name: 'FormPage',

  components: {
    ListForms: defineAsyncComponent(
      () => import('components/form/ListFormsComponent.vue')
    ),
    CreateForm: defineAsyncComponent(
      () => import('components/form/CreateFormComponent.vue')
    ),
  },

  data() {
    const page = 'index';
    const otherPages: string[] = [];
    const formsStore = useFormsStore();

    return {
      page,
      otherPages,
      formsStore,
    };
  },
});
</script>

<style scoped></style>
