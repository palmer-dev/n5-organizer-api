class AgendaType {
  private readonly name: string;

  static Intern = new AgendaType("Intern");

  static Google = new AgendaType("Google");

  static Apple = new AgendaType("Apple");

  constructor(name: string) {
    this.name = name;
  }

  toString() {
    return this.name;
  }

  static keys() {
    return Object.keys(this);
  }
}

export default AgendaType;
