import {List} from "./list";

export class User {
  name: string = "";
  id: number = 0;
  image: string = "";
  liked?: List[]
  collected?: List[]

  constructor(obj: User) {
    Object.assign(this, obj);
  }
}

