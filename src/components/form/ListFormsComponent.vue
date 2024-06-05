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
      v-for="(form, index) in formsStore.getForms"
      :key="index"
      clickable
      @click="showQuestions[index] = true"
      class="shadow-1 q-mb-xs"
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
import useFormsStore, { IForm } from 'stores/useFormsStore';

export default defineComponent({
  name: 'ListFormsComponent',

  components: {
    RenderForm: defineAsyncComponent(
      () => import('components/form/listForms/RenderFormComponent.vue')
    ),
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

    return {
      formsStore,
      openActions,
      showQuestions,
      optionsOrder,
    };
  },

  methods: {
    async allForms() {
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
      await this.$api
        .get('api/form', {
          params: {
            page: this.formsStore.page.current * 2 - 1,
          },
        })
        .then(async (response) => {
          const forms: IForm[] = [];
          this.formsStore.page.all = response.data.all;
          forms.push(...response.data.forms.data);
          if (this.formsStore.forms.length === 0) {
            this.formsStore.setForms(forms);
          }

          //Outra request para pegar mais 5 formulários
          //Objetivo é diminuir a grande quantidade de dados de uma unica vez.

          notify({
            message: 'Estamos terminando de carregar seus formulários',
          });
          await this.$api
            .get('api/form', {
              params: {
                page: this.formsStore.page.current * 2,
              },
            })
            .then((response) => {
              this.formsStore.setForms([...forms, ...response.data.forms.data]);
            })
            .catch((error) => {
              console.log(error);
              this.formsStore.setForms(forms);
              notify({
                spinner: false,
                icon: 'warning',
                timeout: 2000,
                color: 'red-5',
                message: 'Não foi possivel carregar todos os formulários',
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
            });
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
