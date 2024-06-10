<template>
  <SimpleProfileData />

  <q-card :class="['bg-' + bgCard, 'col-11 my-6']">
    <q-card-section class="flex justify-between">
      <div class="text-h6">Alterar senha:</div>
      <div>
        <q-icon name="mdi-help" size="md">
          <q-tooltip class="text-h6">
            É necessário preencher todos os campus e clicar no botão de
            alterar
          </q-tooltip>
        </q-icon>
      </div>
    </q-card-section>
    <q-form @submit.prevent="submit">
      <q-card-section>
        <q-input
          v-model="editPassword.current_password"
          label="Senha atual"
          outlined
          class="mb-2"
          type="password"
          :disable="loading"
          :loading="loading"
          :rules="rulesDefault"
        />
        <q-input
          v-model="editPassword.password"
          label="Nova senha"
          outlined
          class="mb-2"
          :type="showPassword.password ? 'text' : 'password'"
          :disable="loading"
          :loading="loading"
          :rules="rulesPassword"
        >
          <template #append>
            <q-icon
              :name="`mdi-${showPassword.password ? 'eye-outline' : 'eye-off-outline'}`"
              @click="showPassword.password = !showPassword.password"
            />
          </template>
        </q-input>
        <q-input
          v-model="editPassword.password_confirmation"
          label="Confirme sua senha"
          outlined
          class="mb-2"
          :type="showPassword.confirmation ? 'text' : 'password'"
          :disable="loading"
          :loading="loading"
          :rules="rulesConfirmationPassword"
        >
          <template #append>
            <q-icon
              :name="`mdi-${showPassword.confirmation ? 'eye-outline' : 'eye-off-outline'}`"
              @click="showPassword.confirmation = !showPassword.confirmation"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions>
        <q-btn
          color="primary"
          push
          type="submit"
          :disable="loading"
          :loading="loading"
        >Alterar senha</q-btn>
        <q-btn
          :disable="loading"
          type="button"
          @click="clearInputs"
        >Limpar</q-btn>
      </q-card-actions>
    </q-form>
  </q-card>

  <DeleteAccount />
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';

export default defineComponent({
  name: 'ProfilePage',

  components: {
    SimpleProfileData: defineAsyncComponent(() => import('components/profile/SimpleProfileData.vue')),
    DeleteAccount: defineAsyncComponent(() => import('components/profile/DeleteAccount.vue'))
  },

  data() {
    const editPassword = {
      current_password: '',
      password: '',
      password_confirmation: '',
    };
    const showPassword = {
      password: false,
      confirmation: false
    }
    const loading = false;
    const bgCard = '';

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

    return {
      editPassword,
      showPassword,
      loading,
      bgCard,
      rulesDefault,
      rulesPassword,
      rulesConfirmationPassword: [
        ...rulesDefault,
        (value: string): boolean | string => {
          return value === editPassword.password_confirmation
            ? true
            : 'Senhas diferentes!';
        },
      ]
    };
  },

  methods: {
    async submit() {
      this.loading = true;
      const notify = this.$q.notify({
        message: 'Atualizando...',
        spinner: true,
        group: false,
        timeout: 0
      });
      await this.$api.patch('api/profile/password', this.editPassword)
        .then(response => {
          if(response.data) {
            this.clearInputs();
            this.alterBgCard();
            notify({
              message: 'Senha atualizada com sucesso',
              icon: 'cloud_done',
              spinner: false,
              timeout: 2000,
              color: 'green-4'
            });
          } else {
            notify({
              message: 'Não foi possivel atualizar sua senha',
              icon: 'cloud_done',
              spinner: false,
              timeout: 2000,
              color: 'red-5'
            });
          }
        })
        .catch((error) => {
          console.log(error);
          notify({
            message: 'Não foi possivel atualizar sua senha',
            icon: 'cloud_done',
            spinner: false,
            timeout: 2000,
            color: 'red-5'
          });
        })
        .finally(() => {
          this.loading = false;
        })
    },
    clearInputs(): void {
      this.editPassword = {
        current_password: '',
        password: '',
        password_confirmation: '',
      };
      this.showPassword = {
        password: false,
        confirmation: false
      }
    },
    alterBgCard() {
      let i = 6;
      const timeBgCard = setInterval(() => {
        this.bgCard = `green-${i}`;
        i--;
        if(i === 0) {
          this.bgCard = '';
          clearInterval(timeBgCard);
        }
      }, 50);
    }
  }
});
</script>

<style scoped lang="scss">

</style>
