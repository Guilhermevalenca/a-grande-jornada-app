<template>
  <q-input
    v-model="modelTitle"
    outlined
    placeholder="Escreva a pergunta aqui"
    :readonly="getDisable"
    :loading="getDisable"
    :rules="rules"
  />
  <br>
  <q-card v-for="(option, index) in modelOptions" :key="index">
    <q-card-actions class="flex justify-between">
      <div class="text-h6">Opção {{index + 1}}</div>
      <q-btn
        icon="mdi-minus"
        rounded push
        color="warning"
        v-if="Number(index) !== 0 || modelOptions.length > 1"
        @click="removeOption(Number(index))"
        :disable="getDisable"
      >
        <q-tooltip>
          <div class="text-h6">Remove Opção</div>
          <p>Cuidado, essa opção não poderá ser recuperada</p>
        </q-tooltip>
      </q-btn>
    </q-card-actions>
    <q-card-section>
      <OptionForm
        v-model:title="option.title"
        v-model:isOpen="option.isOpen"
        v-model:correctAlternative="option.correctAlternative"
        :disable="getDisable"
      />
    </q-card-section>
  </q-card>
  <br>
  <div class="flex justify-end">
    <q-btn
      icon="mdi-plus"
      rounded push
      color="secondary"
      @click="addOption"
      :disable="getDisable"
    >
      <q-tooltip>
        <div class="text-h6">Adicionar Opção</div>
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, PropType } from 'vue';
import {IOption} from 'stores/useFormsStore';

export default defineComponent({
  name: 'QuestionFormComponent',

  components: {
      OptionForm: defineAsyncComponent(() => import('components/form/createForm/OptionFormComponent.vue'))
  },

  props: {
    title: {
      type: String,
      required: true
    },
    options: {
      type: Object as PropType<IOption[]>,
      required: true,
    },
    disable: {
      type: Boolean,
      required: true
    }
  },

  emits: ['update:title', 'update:options'],

  computed: {
    modelTitle: {
      get(): string {
        return this.title;
      },
      set($value: string) {
        this.$emit('update:title', $value);
      }
    },
    modelOptions: {
      get(): IOption[] {
        return this.options;
      },
      set($value: string) {
        this.$emit('update:options', $value);
      }
    },
    getDisable(): boolean {
      return this.disable;
    }
  },

  data() {
    const rules = [
      (value: string): string | boolean => {
        return value ? !!value : 'É necessário dizer qual é a pergunta!';
      }
    ];

    return {
      rules
    }
  },

  methods: {
    addOption() {
      this.modelOptions.push({
        title: '',
        isOpen: false,
        correctAlternative: false
      });
    },
    removeOption(index: number) {
      this.modelOptions.splice(index, 1);
    }
  }
});
</script>

<style scoped>

</style>
