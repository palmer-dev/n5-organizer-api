import AbstractManager from "@models/AbstractManager";
import Appointment from "@schemas/Appointment.js";
import { AppointmentDocument } from "@/types/AppointmentDocument";

class AppointmentManager extends AbstractManager<AppointmentDocument> {
  constructor() {
    super(Appointment);
  }
}

export default AppointmentManager;
