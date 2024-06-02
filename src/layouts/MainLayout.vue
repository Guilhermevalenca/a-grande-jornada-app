<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          A grande jornada
        </q-toolbar-title>
        <div>
          <q-btn
            icon="mdi-theme-light-dark"
            @click="$q.dark.toggle()"
            round
            flat
            push
            class="q-mr-xs"
          >
            <q-tooltip>
              Alterar tema!
            </q-tooltip>
          </q-btn>
        </div>
        <div v-if="userStore.id">
          <q-btn-dropdown
            :label="userStore.name"
          >
            <div class="row no-wrap q-pa-md">
              <div class="column items-center">
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="avatar">
                </q-avatar>
                <div class="text-subtitle1">
                  {{userStore.name}}
                </div>

                <q-list class="q-mt-md rounded-borders" separator bordered>
                  <q-item clickable class="flex items-center">
                    <q-icon name="mdi-account-circle" />
                    Meu perfil
                  </q-item>
                  <q-item clickable class="items-center">
                    <q-icon name="mdi-cog" />
                    Configurações
                  </q-item>
                  <q-item>
                    <q-btn
                      color="negative"
                      push
                      @click="logout"
                    >
                      Desconectar
                    </q-btn>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-btn-dropdown>
        </div>
        <div v-else>
          <q-btn push :to="{name: 'auth'}">Login</q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Navegação
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="row items-center justify-evenly">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
import useUserStore from 'stores/useUserStore';

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  data () {
    const userStore = useUserStore();
    const linksList: EssentialLinkProps[] = [
      {
        title: 'Pagina inicial',
        // caption: 'quasar.dev',
        icon: 'mdi-home',
        name: 'home'
      },
      {
        title: 'Formulários',
        caption: 'Seus formulários',
        icon: 'mdi-form-select',
        name: 'forms',
        isLogged: true
      },
      {
        title: 'Funcionalidade 2',
        caption: 'Só deus sabe que desgraça isso faz',
        icon: 'school',
        name: ''
      }
    ];

    return {
      linksList,
      leftDrawerOpen: false,
      userStore
    }
  },

  methods: {
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    async logout() {
      localStorage.removeItem('token');
      this.userStore.$reset();
      await this.$api.post('api/logout')
        .then(() => {
          this.$router.push({
            name: 'home'
          });
        })
        .finally(() => this.$api.defaults.headers.common.Authorization = '');
    }
  }
});
</script>
