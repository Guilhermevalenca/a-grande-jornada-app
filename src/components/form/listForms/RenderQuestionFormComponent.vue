<template>
  <q-expansion-item
    :label="`${index + 1}) ${question.title}`"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">Opções:</div>
      </q-card-section>
      <q-card-section>
        <q-list>
          <RenderOption
            v-for="(option, indexO) in question.options" :key="indexO"
            :option="option"
            :index="indexO"
          />
        </q-list>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, PropType } from 'vue';
import { IQuestion } from 'stores/useFormsStore';

export default defineComponent({
  name: 'RenderQuestionFormComponent',

  components: {
    RenderOption: defineAsyncComponent(() => import('components/form/listForms/RenderOptionFormComponent.vue'))
  },

  props: {
    question: {
      type: Object as PropType<IQuestion>,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  }
});
</script>

<style scoped>

</style>
