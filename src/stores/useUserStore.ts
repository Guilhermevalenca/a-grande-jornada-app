import { defineStore } from 'pinia';

export interface IUser {
  id?: number,
  name: string,
  email: string
}
export default defineStore('user', {
  state: (): IUser => ({
    id: 0,
    name: '',
    email: ''
  }),
  actions: {
    setUser(user: IUser): void {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
    }
  }
})
