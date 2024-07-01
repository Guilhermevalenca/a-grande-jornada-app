<template>
  <q-input
    v-model="modelOption.title"
    outlined
    class="q-mb-sm"
    placeholder="Opção..."
    :disable="disable"
  >
    <template #after>
      <q-btn
        icon="mdi-minus"
        round
        push
        color="warning"
        @click="$emit('removeOption')"
      >
        <q-tooltip>
          <div class="text-h6">Remover Opção</div>
          <p>Cuidado, essa opção não poderá ser recuperada</p>
        </q-tooltip>
      </q-btn>
    </template>
  </q-input>
  <q-toggle
    label="Essa é a alternativa correta ?"
    v-model="modelOption.correctAlternative"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IOption } from 'stores/useFormsStore';

export default defineComponent({
  name: 'EditOptionFormComponent',

  props: {
    option: {
      type: Object as PropType<IOption>,
      required: true,
    },
    disable: {
      type: Boolean,
      required: true,
    },
  },

  emits: ['update:option', 'removeOption'],

  data: () => ({
    saveTitle: '',
  }),

  computed: {
    modelOption: {
      get(): IOption {
        return this.option;
      },
      set($value: IOption) {
        this.$emit('update:option', $value);
      },
    },
  },

  methods: {
    relationshipTitleAndIsOpen(value: boolean) {
      if (value) {
        this.saveTitle = this.modelOption.title;
        this.modelOption.title = '';
      } else {
        this.modelOption.title = this.saveTitle;
      }
    },
  },

  mounted() {
    this.modelOption.correctAlternative = Boolean(
      this.modelOption.correctAlternative
    );
  },
});
</script>

<style scoped></style>
