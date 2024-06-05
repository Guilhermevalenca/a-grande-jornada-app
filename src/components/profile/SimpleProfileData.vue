<template>
  <q-card class="col-11 my-6">
    <q-card-section class="flex justify-between">
      <div class="text-h6">Seus dados:</div>
      <div>
        <q-icon name="mdi-help" size="md">
          <q-tooltip class="text-h6">
            De dois clique em qualquer informação para editar
          </q-tooltip>
        </q-icon>
      </div>
    </q-card-section>
    <q-card-section :class="['bg-' + bgInput.name, 'row items-center border']">
      <strong class="mr-1">Nome:</strong>
      <div class="col-11">
          <span
            v-if="!showEdit.name"
            @dblclick="showEdit.name = true"
            class="full-width"
          >{{ userStore.name }}</span>
        <q-form v-else @submit.prevent="updateName">
          <q-input
            v-model="editUser.name"
            :loading="loading.name"
            :disable="loading.name"
          >
            <template #append>
              <q-btn
                icon="save"
                flat round
                color="primary"
              >
                <q-tooltip class="text-h6"> Salvar </q-tooltip>
              </q-btn>
              <q-icon name="close" @click="showEdit.name = false; editUser.name = userStore.name;">
                <q-tooltip class="text-h6"> Cancelar </q-tooltip>
              </q-icon>
            </template>
          </q-input>
        </q-form>
      </div>
    </q-card-section>
    <q-card-section :class="['bg-' + bgInput.email, 'row items-center border']">
      <strong class="mr-1">Email:</strong>
      <div class="col-11">
          <span v-if="!showEdit.email" @dblclick="showEdit.email = true">
            {{ userStore.email }}
          </span>
        <q-form v-else @submit.prevent="updateEmail">
          <q-input
            v-model="editUser.email"
            :loading="loading.email"
            :disable="loading.email"
          >
            <template #append>
              <q-btn icon="save" flat round color="primary">
                <q-tooltip class="text-h6"> Salvar </q-tooltip>
              </q-btn>
              <q-icon name="close" @click="showEdit.email = false; editUser.email = userStore.email">
                <q-tooltip class="text-h6"> Cancelar </q-tooltip>
              </q-icon>
            </template>
          </q-input>
        </q-form>
      </div>
    </q-card-section>
  </q-card>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import useUserStore, { IUser } from 'stores/useUserStore';

export default defineComponent({
  name: 'SimpleProfileData',

  data() {
    const userStore = useUserStore();
    const editUser: IUser = {
      name: userStore.name,
      email: userStore.email,
    };
    const showEdit = {
      name: false,
      email: false,
    };
    const loading = {
      name: false,
      email: false
    }
    const bgInput = {
      name: '',
      email: ''
    }

    return {
      userStore,
      editUser,
      showEdit,
      loading,
      bgInput
    }
  },

  methods: {
    async updateName(): Promise<void> {
      this.loading.name = true;
      const notify = this.$q.notify({
        spinner: true,
        message: 'Atualizando...',
        timeout: 0,
        group: false
      });
      await this.$api.patch('api/profile/name/', {
        name: this.editUser.name
      })
        .then((response) => {
          if(response.data) {
            this.alterBgInput('name');
            this.userStore.name = this.editUser.name;
            notify({
              color: 'green-4',
              icon: 'cloud_done',
              timeout: 2000,
              message: 'Nome de usuário atualizado com sucesso',
              spinner: false
            });
          } else {
            notify({
              color: 'red-5',
              icon: 'warning',
              timeout: 2000,
              message: 'Ops! Não foi possivel atualizar seu nome, tente novamente mais tarde.',
              spinner: false
            });
          }
        })
        .catch(() => {
          notify({
            color: 'red-5',
            icon: 'warning',
            timeout: 2000,
            message: 'Ops! Não foi possivel atualizar seu nome, tente novamente mais tarde.',
            spinner: false
          });
        })
        .finally(() => {
          this.loading.name = false;
        })
    },
    async updateEmail(): Promise<void> {
      this.loading.email = true;
      const notify = this.$q.notify({
        spinner: true,
        message: 'Atualizando...',
        timeout: 0,
        group: false
      });
      await this.$api.patch('api/profile/email/', {
        email: this.editUser.email
      })
        .then(response => {
          if(response.data) {
            this.alterBgInput('email');
            this.userStore.email = this.editUser.email;
            notify({
              color: 'green-4',
              message: 'Email atualizado com sucesso',
              icon: 'cloud_done',
              timeout: 2000,
              spinner: false
            });
          } else {
            notify({
              color: 'red-5',
              message: 'Não foi possivel atualizar seu email, porfavor tente novamente mais tarde',
              icon: 'warning',
              timeout: 2000,
              spinner: false
            });
          }
        })
        .catch(() => {
          notify({
            color: 'red-5',
            message: 'Não foi possivel atualizar seu email, porfavor tente novamente mais tarde',
            spinner: false,
            icon: 'warning',
            timeout: 2000
          });
        })
        .finally(() => {
          this.loading.email = false;
        })
    },
    alterBgInput(whichInput: 'email' | 'name') {
      let i = 6;
      const timeBgInput = setInterval(() => {
        this.bgInput[whichInput] = `green-${i}`;
        i--;
        if(i === 3) {
          this.showEdit[whichInput] = false;
        }
        if(i === 0) {
          this.bgInput[whichInput] = '';
          clearInterval(timeBgInput);
        }
      }, 50);
    }
  }
});
</script>

<style scoped>

</style>
