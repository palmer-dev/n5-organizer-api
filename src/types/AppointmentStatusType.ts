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
}

export default AppointmentStatusType;
