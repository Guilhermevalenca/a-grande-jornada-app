<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useUserStore from 'stores/useUserStore';

export default defineComponent({
  name: 'App',

  methods: {
    async isAuthUser() {
      const token = localStorage.getItem('token');
      if(token) {
        const userStore = useUserStore()
        this.$api.defaults.headers.common.Authorization = `Bearer ${token}`;
        await this.$api.get('api/user')
          .then(response => {
            userStore.setUser(response.data);
          })
          .catch(() => {
            localStorage.removeItem('token');
            this.$api.defaults.headers.common.Authorization = '';
          })
      }
    }
  },

  created() {
    this.isAuthUser();
  }
});
</script>
