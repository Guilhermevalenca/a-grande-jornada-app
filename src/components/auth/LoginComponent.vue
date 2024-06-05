<template>
  <q-form @submit.prevent="submit">
    <q-input label="Email" v-model="form.email" disable outlined />
    <br />
    <q-input
      label="Senha"
      placeholder="Digite sua senha"
      v-model="form.password"
      outlined
      :disable="loading"
      :type="showPassword ? 'text' : 'password'"
      :rules="rulesPassword"
    >
      <template #append>
        <q-icon
          :name="`mdi-${showPassword ? 'eye-outline' : 'eye-off-outline'}`"
          @click="showPassword = !showPassword"
        />
      </template>
    </q-input>
    <div>
      <div class="flex justify-end">
        <q-btn type="button" @click="$emit('previousForm')" :disable="loading"
          >Voltar</q-btn
        >
        <q-btn push type="submit" color="primary" :loading="loading"
          >Login</q-btn
        >
      </div>
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useUserStore from 'stores/useUserStore';

export default defineComponent({
  name: 'LoginComponent',

  props: {
    email: {
      type: String,
      required: true,
    },
  },

  emits: ['previousForm'],

  data() {
    const form = {
      email: this.email,
      password: '',
    };
    const loading = false;
    const userStore = useUserStore();
    const showPassword = false;
    const rulesPassword = [
      (value: string): boolean | string => {
        return value ? !!value : 'É necessário digitar sua senha!';
      },
      (value: string): boolean | string => {
        if (value.length < 8) {
          return 'Sua senha deve conter no minimo 8 digitos';
        } else if (/[A-Za-z]/.test(value) && /\d/.test(value)) {
          return true;
        } else {
          return 'Sua senha deve conter números e letras';
        }
      },
    ];

    return {
      form,
      loading,
      userStore,
      showPassword,
      rulesPassword,
    };
  },

  methods: {
    async submit() {
      this.loading = true;
      await this.$api
        .post('api/login', this.form)
        .then((response) => {
          localStorage.setItem('token', response.data.token);
          this.userStore.setUser(response.data.user);
          this.$api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;

          this.$router.push({
            name: 'home',
          });
        })
        .catch((error) => console.log(error))
        .finally(() => (this.loading = false));
    },
  },
});
</script>

<style scoped></style>
