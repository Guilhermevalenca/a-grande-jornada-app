<template>
  <section class="col-11">
    <div class="flex justify-center q-mb-lg q-mt-xl">
      <q-btn
        @click="page = 'index'"
        push
        :color="page === 'index' ? '' : 'primary'"
        :text-color="page === 'index' ? 'black' : ''"
        size="lg"
      >Ver formulários
      </q-btn>
      <q-btn
        @click="page = 'create'"
        push
        :color="page === 'index' ? 'primary' : ''"
        :text-color="page === 'index' ? '' : 'black'"
        size="lg"
      >Criar formulários
      </q-btn>
    </div>
    <q-card
      :class="formsStore.forms.length === 0 && page !== 'create' ? 'window-height' : 'full-height'"
      :flat="page === 'index'"
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
    ListForms: defineAsyncComponent({
      loader: () => import('components/form/ListFormsComponent.vue'),
      delay: 500
    }),
    CreateForm: defineAsyncComponent(
      () => import('components/form/CreateFormComponent.vue')
    ),
  },

  data() {
    const page = 'index';
    const formsStore = useFormsStore();

    return {
      page,
      formsStore,
    };
  },
});
</script>

<style scoped></style>
