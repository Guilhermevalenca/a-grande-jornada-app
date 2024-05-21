<template>
  <q-item
    clickable
    :to="{name: name}"
    :active="$route.name === name"
    v-if="!isLogged || !!userStore.id"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useUserStore from 'stores/useUserStore';

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  name?: string;
  icon?: string;
  isLogged?: boolean;
}

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    name: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    },

    isLogged: {
      type: Boolean,
      default: false
    }
  },

  data() {
    const userStore = useUserStore();

    return {
      userStore
    }
  }
});
</script>
