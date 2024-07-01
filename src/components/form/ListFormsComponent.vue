<template>
  <q-list bordered class="rounded-borders">
    <q-item class="shadow-1">
      <q-item-section class="q-pb-lg">
        <div class="row justify-end items-center">
          <q-select
            class="col-2"
            v-model="orderBy"
            :options="optionsOrder"
            outlined
            label="Ordenar por:"
          />
          <q-btn
            :icon="`mdi-${
              formsStore.reverse ? 'arrow-up-bold' : 'arrow-down-bold'
            }`"
            @click="formsStore.handlerReverse()"
            flat
            push
            size="lg"
            round
          >
            <q-tooltip class="text-h6">
              {{ formsStore.reverse ? 'Ordem crescente' : 'Ordem decrescente' }}
            </q-tooltip>
          </q-btn>
          <q-icon name="mdi-help" size="sm">
            <q-tooltip class="text-h6">
              Mudar a ordem, afeta apenas a pagina atual
            </q-tooltip>
          </q-icon>
        </div>
      </q-item-section>
    </q-item>
    <q-item
      v-show="formsStore.forms.length === 0"
    >
      <div class="text-h4"><i>Carregando...</i></div>
    </q-item>
    <q-item
      v-for="(form, index) in formsStore.getForms"
      :key="index"
      clickable
      @click="showQuestions[index] = true"
      class="shadow-1 q-mb-xs"
      :disable="loadingForms"
    >
      <RenderForm
        :form="form"
        :index="index"
        v-model:showQuestions="showQuestions[index]"
        @allForms="allForms"
      />
    </q-item>
    <q-item class="flex justify-end">
      <q-pagination
        v-model="formsStore.page.current"
        :max="formsStore.page.all"
        direction-links
        round
        @update:model-value="allForms()"
      />
    </q-item>
  </q-list>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import useFormsStore from 'stores/useFormsStore';

export default defineComponent({
  name: 'ListFormsComponent',

  components: {
    RenderForm: defineAsyncComponent({
      loader: () => import('components/form/listForms/RenderFormComponent.vue'),
      delay: 500,
    }),
  },

  data() {
    const formsStore = useFormsStore();
    const openActions: boolean[] = [];
    const showQuestions: boolean[] = [];
    const optionsOrder = [
      {
        label: 'Criado',
        value: 'created',
      },
      {
        label: 'Atualizado',
        value: 'updated',
      },
    ];
    const loadingForms = false;

    return {
      formsStore,
      openActions,
      showQuestions,
      optionsOrder,
      loadingForms
    };
  },

  methods: {
    async allForms(): Promise<void> {
      this.loadingForms = true;
      const notify = this.$q.notify({
        spinner: true,
        message:
          this.formsStore.forms.length === 0
            ? 'Carregando formulários'
            : 'Atualizando formulários',
        // position: 'center',
        spinnerSize: 'xl',
        timeout: 0,
        group: false,
      });
      //request para pegar 5 formulários
      await this.$api.get('api/form', {
          params: {
            page: this.formsStore.page.current,
          },
        })
        .then((response) => {
          this.formsStore.page.all = response.data.all;
          this.formsStore.setForms(response.data.forms.data);
        })
        .catch((error) => {
          console.log(error);
          notify({
            icon: 'warning',
            spinner: false,
            message: 'Não foi possivel carregar nenhum formulário',
            timeout: 2000,
            color: 'red-5',
          });
        })
        .finally(() => {
          notify({
            icon: 'done',
            spinner: false,
            message: 'Formulários carregados com sucesso',
            timeout: 2000,
            color: 'green-4',
          });
          this.loadingForms = false;
        });
    },
  },

  computed: {
    orderBy: {
      get() {
        return this.formsStore.order === 'created' ? 'Criado' : 'Atualizado';
      },
      set($value: { label: string; value: 'created' | 'updated' }) {
        this.formsStore.order = $value.value;
      },
    },
  },

  mounted() {
    this.allForms();
  },
});
</script>

<style scoped></style>
