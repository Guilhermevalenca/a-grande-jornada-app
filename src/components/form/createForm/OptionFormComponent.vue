<template>
  <q-input
    v-model="modelTitle"
    :placeholder="modelIsOpen ? 'Pergunta aberta' : 'Digite a opção aqui'"
    outlined
    :disable="modelIsOpen"
    :loading="getDisable"
    :readonly="getDisable"
    :rules="rules"
    class="col-12"
  >
    <template #before>
      <div>{{ index + 1 }} -</div>
    </template>
    <template #after>
      <q-btn
        icon="mdi-minus"
        rounded
        push
        color="warning"
        v-show="removeOptionAbilite"
        @click="$emit('removeOption')"
      >
        <q-tooltip>
          <div class="text-h6">Remover Opção</div>
          <p>Cuidado, essa opção não poderá ser recuperada</p>
        </q-tooltip>
      </q-btn>
    </template>
  </q-input>
  <div class="flex items-center"></div>
  <q-toggle
    v-show="!modelIsOpen"
    v-model="modelCorrectAlternative"
    label="Essa é a alternativa correta ?"
    :disable="getDisable"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'OptionFormComponent',

  props: {
    title: {
      type: String,
      default: '',
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    correctAlternative: {
      type: Boolean,
      default: false,
    },
    disable: {
      type: Boolean,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeOptionAbilite: {
      type: Boolean,
      required: true,
    },
  },

  emits: [
    'update:title',
    'update:isOpen',
    'update:correctAlternative',
    'removeOption',
  ],

  computed: {
    modelTitle: {
      get(): string {
        return this.title;
      },
      set($value: string) {
        this.$emit('update:title', $value);
      },
    },
    modelIsOpen: {
      get(): boolean {
        return this.isOpen;
      },
      set($value: boolean) {
        if ($value) {
          this.modelCorrectAlternative = false;
          this.salveText = this.modelTitle;
          this.modelTitle = '';
        } else {
          this.modelTitle = this.salveText;
        }
        this.$emit('update:isOpen', $value);
      },
    },
    modelCorrectAlternative: {
      get(): boolean {
        return this.correctAlternative;
      },
      set($value: boolean) {
        this.$emit('update:correctAlternative', $value);
      },
    },
    getDisable(): boolean {
      return this.disable;
    },
  },

  data() {
    const salveText = '';
    const rules = [
      (value: string): string | boolean => {
        return !!value || this.modelIsOpen
          ? true
          : 'É necessário preencher este campo';
      },
    ];

    return {
      salveText,
      rules,
    };
  },
});
</script>

<style scoped></style>
