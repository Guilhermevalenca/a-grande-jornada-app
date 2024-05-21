import { defineStore } from 'pinia';

export interface IOption {
  id?: number,
  title: string,
  isOpen: boolean,
  correctAlternative: boolean
}

export interface IQuestion {
  id?: number,
  title: string,
  form_id?: number,
  options: IOption[]
}

export interface IForm {
  id?: number,
  title: string,
  user_id?: number,
  updated_at?: string,
  questions: IQuestion[]
}

export default defineStore('forms', {
  state: () => ({
    forms: [] as IForm[],
    reverse: false,
    order: 'created' as 'created' | 'updated'
  }),
  getters: {
    getForms(state) {
      let forms: IForm[];
      if(state.order === 'updated') {
        //Organizando formulários por data de atualização
        forms = [...state.forms].sort((a: IForm, b:IForm) => {
          if (!a.updated_at && b.updated_at) {
            return -1;
          }
          if (!b.updated_at && a.updated_at) {
            return 1;
          }

          const dateA = a.updated_at ? new Date(a.updated_at) : new Date(0);
          const dateB = b.updated_at ? new Date(b.updated_at) : new Date(0);

          return dateA.getTime() - dateB.getTime();
        });
      } else {
        forms = state.forms;
      }
      return state.reverse ? forms.reverse() : forms;
    }
  },
  actions: {
    addForm(form: IForm) {
      this.forms.push(form);
    },
    addManyForms(forms: IForm[]) {
      this.forms.push(...forms);
    },
    setForms(forms: IForm[]) {
      this.forms = forms;
    }
  }
})
