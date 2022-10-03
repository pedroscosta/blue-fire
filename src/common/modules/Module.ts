export default class Module {
  private name: string;

  constructor({ name }: { name: string }) {
    this.name = name;
  }

  getName() {
    return this.name;
  }
}
