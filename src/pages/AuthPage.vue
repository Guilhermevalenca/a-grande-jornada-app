<template xmlns:q-card-section="http://www.w3.org/1999/html">
  <q-card class="col-4">
    <q-card-section class="flex justify-end">
      <q-btn icon="mdi-help" round color="secondary" size="sm">
        <q-tooltip :hide-delay="1000">
          Digite seu email para fazer login, caso não esteja logado você será direcionado para a tela de cadastro
        </q-tooltip>
      </q-btn>
    </q-card-section>
    <q-card-section>
      <q-tab-panels v-model="panel">
        <q-tab-panel name="start">
          <q-form @submit.prevent="submit">
            <q-input
              outlined
              v-model="email"
              label="Email"
              type="email"
              placeholder="Digite seu email"
              :disable="loading"
              :rules="rulesEmail"
            />
            <br>
            <div class="flex justify-end">
              <q-btn
                type="submit"
                color="primary"
                :loading="loading"
                push
              >Prosseguir</q-btn>
            </div>
          </q-form>
        </q-tab-panel>
        <q-tab-panel name="login">
          <LoginComponent
            :email="email"
            @previousForm="panel = 'start'"
          />
        </q-tab-panel>
        <q-tab-panel name="create">
          <CreateComponent
            :email="email"
            @previousForm="panel = 'start'"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
  </q-card>

</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';

export default defineComponent({
  name: 'AuthPage',
  components: {
    CreateComponent: defineAsyncComponent(() => import('components/auth/CreateComponent.vue')),
    LoginComponent: defineAsyncComponent(() => import('components/auth/LoginComponent.vue'))
  },

  data() {
    const email = '';
    const panel = 'start';
    const loading = false;
    const rulesEmail = [
      (value: string): boolean | string => {
        return value ? !!value : 'É necessário digitar um email!'
      },
      (value: string): boolean | string => {
        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return true;
        }
        return 'Email invalido!';
      }
    ]

    return {
      email,
      panel,
      loading,
      rulesEmail
    }
  },

  methods: {
    async submit() {
      this.loading = true;
      await this.$api.post('api/has-registration', {
        email: this.email
      })
        .then(response => {
          this.panel = response.data ? 'login' : 'create';
        })
        .catch(error => console.log(error))
        .finally(() => this.loading = false);
    }
  }
});
</script>

<style scoped>

</style>
