<template>
  <q-form @submit.prevent="submit">
    <q-input
      label="Nome"
      placeholder="Digite seu nome"
      v-model="form.name"
      outlined
      :disable="loading"
      :rules="rulesDefault"
    />
    <br />
    <q-input label="Email" v-model="form.email" disable outlined />
    <br />
    <q-input
      label="Senha"
      placeholder="Digite sua senha"
      v-model="form.password"
      outlined
      :disable="loading"
      :rules="rulesPassword"
      :type="show.password ? 'text' : 'password'"
    >
      <template #append>
        <q-icon
          :name="`mdi-${show.password ? 'eye-outline' : 'eye-off-outline'}`"
          @click="show.password = !show.password"
        />
      </template>
    </q-input>
    <br />
    <q-input
      label="Confirme sua senha"
      v-model="form.password_confirmation"
      outlined
      :disable="loading"
      :rules="rulesConfirmationPassword"
      :type="show.confirm_password ? 'text' : 'password'"
    >
      <template #append>
        <q-icon
          :name="`mdi-${
            show.confirm_password ? 'eye-outline' : 'eye-off-outline'
          }`"
          @click="show.confirm_password = !show.confirm_password"
        />
      </template>
    </q-input>
    <br />
    <div class="flex justify-end">
      <q-btn type="button" @click="$emit('previousForm')" :disable="loading"
        >Voltar</q-btn
      >
      <q-btn push type="submit" color="primary" :loading="loading"
        >Criar conta</q-btn
      >
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useUserStore from 'stores/useUserStore';

export default defineComponent({
  name: 'CreateComponent',

  props: {
    email: {
      type: String,
      required: true,
    },
  },

  emits: ['previousForm'],

  data() {
    const form = {
      name: '',
      email: this.email,
      password: '',
      password_confirmation: '',
    };
    const loading = false;
    const userStore = useUserStore();
    const rulesDefault = [
      (value: string): string | boolean => {
        return value ? !!value : 'É necessário preencher esse campo';
      },
    ];
    const rulesPassword = [
      ...rulesDefault,
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
    const rulesConfirmationPassword = [
      ...rulesDefault,
      (value: string): boolean | string => {
        return value === form.password_confirmation
          ? true
          : 'Senhas diferentes!';
      },
    ];

    const show = {
      password: false,
      confirm_password: false,
    };

    return {
      form,
      loading,
      userStore,
      rulesDefault,
      rulesPassword,
      rulesConfirmationPassword,
      show,
    };
  },

  methods: {
    async submit() {
      this.loading = true;
      await this.$api
        .post('api/register', this.form)
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
