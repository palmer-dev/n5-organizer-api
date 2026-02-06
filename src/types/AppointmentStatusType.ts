class AppointmentStatusType {
  private readonly name: string;

  static Validated = new AppointmentStatusType("Validated");

  static Refused = new AppointmentStatusType("Refused");

  static Pending = new AppointmentStatusType("Pending");

  constructor(name: string) {
    this.name = name;
  }

  toString() {
    return this.name;
  }

  static keys() {
    return Object.keys(this);
  }

  static values(): string[] {
    return Object.values(this).map((value) => value.toString());
  }
}

export default AppointmentStatusType;
