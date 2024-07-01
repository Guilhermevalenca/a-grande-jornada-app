import { defineStore } from 'pinia';

export interface IOption {
  id?: number;
  title: string;
  correctAlternative: boolean;
}

export interface IQuestion {
  id?: number;
  title: string;
  form_id?: number;
  options: IOption[];
  type: 'isOpen' | 'only' | 'multiple'
}

export interface IForm {
  id?: number;
  title: string;
  user_id?: number;
  updated_at?: string;
  questions: IQuestion[];
}

export default defineStore('forms', {
  state: () => ({
    forms: [] as IForm[],
    reverse: false,
    order: 'updated' as 'created' | 'updated',
    page: {
      current: 1,
      all: 0,
    },
  }),
  getters: {
    getForms(state): IForm[] {
      const forms: IForm[] = [...state.forms];
      if (state.order === 'created') {
        //Organizando formulários por data de atualização
        forms.sort((a: IForm, b: IForm) => Number(a.id) - Number(b.id));
      }
      return state.reverse ? forms.reverse() : forms;
    },
  },
  actions: {
    addForm(form: IForm): void {
      this.forms.push(form);
    },
    addManyForms(forms: IForm[]): void {
      this.forms.push(...forms);
    },
    setForms(forms: IForm[]): void {
      this.forms = forms;
    },
    deleteForm(id: number): void {
      const indice = this.forms.findIndex((form) => form.id === id);
      if (indice !== -1) {
        this.forms.splice(indice, 1);
      }
    },
    addQuestions(form_id: number, questions: IQuestion[]) {
      const form = this.forms.find((form: IForm) => form.id === form_id);
      if(form) {
        form.questions = [...questions];
      }
    },
    deleteQuestion(indexForm: number, indexQuestion: number): void {
      this.forms[indexForm].questions.splice(indexQuestion, 1);
    },
    handlerReverse() {
      this.reverse = !this.reverse;
    },
  },
});
