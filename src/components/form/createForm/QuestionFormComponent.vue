<template>
  <q-card-section>
    <q-select
      v-model="typeQuestion"
      @update:modelValue="$emit('update:type', typeQuestion.value)"
      :options="optionsType"
      label="Tipo da questão:"
      outlined
    />
  </q-card-section>
  <q-card-section>
    <q-editor
      v-model="titleQuestion"
      @update:modelValue="$emit('update:title', titleQuestion)"
      outlined
      placeholder="Escreva a pergunta aqui"
      :readonly="disable"
      :loading="disable"
      :rules="rules"
      type="textarea"
    />
  </q-card-section>
  <q-card-section
    class="row"
    v-for="(option, index) in options"
    :key="index"
  >
    <OptionForm
      v-model:title="option.title"
      v-model:correctAlternative="option.correctAlternative"
      :disable="disable"
      :index="index"
      :removeOptionAbilite="Number(index) !== 0 || options.length > 1"
      @removeOption="removeOption(Number(index))"
    />
  </q-card-section>
  <br />
  <div class="flex justify-end">
    <q-btn
      icon="mdi-plus"
      rounded
      push
      color="secondary"
      @click="addOption"
      :disable="disable"
    >
      <q-tooltip>
        <div class="text-h6">Adicionar Opção</div>
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, PropType } from 'vue';
import { IOption } from 'stores/useFormsStore';

export default defineComponent({
  name: 'QuestionFormComponent',

  components: {
    OptionForm: defineAsyncComponent(
      () => import('components/form/createForm/OptionFormComponent.vue')
    ),
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    options: {
      type: Object as PropType<IOption[]>,
      required: true,
    },
    disable: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String as PropType<'isOpen' | 'only' | 'multiple'>,
      required: true
    }
  },

  emits: ['update:title', 'update:options', 'update:type'],

  data() {
    const rules = [
      (value: string): string | boolean => {
        return value ? !!value : 'É necessário dizer qual é a pergunta!';
      },
    ];
    return {
      rules,
      titleQuestion: this.title,
      optionsQuestion: this.options,
      typeQuestion: {
        label: 'Única resposta',
        value: this.type
      },
      optionsType: [
        {
          label: 'Única resposta',
          value: 'only'
        },
        {
          label: 'Múltiplas respostas',
          value: 'multiple'
        },
        {
          label: 'Pergunta aberta',
          value: 'isOpen'
        }
      ]
    };
  },

  methods: {
    addOption() {
      this.optionsQuestion.push({
        title: '',
        correctAlternative: false,
      } as IOption);
      this.$emit('update:options', this.optionsQuestion);
    },
    removeOption(index: number) {
      this.optionsQuestion.splice(index, 1);
      this.$emit('update:options', this.optionsQuestion);
    },
  },

  watch: {
    'typeQuestion.value'($new) {
      if($new === 'isOpen'){
        this.$emit('update:options', []);
      }
    }
  }

});
</script>

