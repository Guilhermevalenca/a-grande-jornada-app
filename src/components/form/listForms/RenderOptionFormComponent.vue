<template>
  <q-item>
    {{index + 1}} - {{option.title ? option.title : 'Opção aberta'}}
  </q-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IOption } from 'stores/useFormsStore';

export default defineComponent({
  name: 'RenderOptionFormComponent',

  props: {
    option: {
      type: Object as PropType<IOption>,
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
