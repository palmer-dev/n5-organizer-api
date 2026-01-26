import AbstractManager from "@/models/AbstractManager";
import Agenda from "@/schemas/Agenda";
import { AgendaDocument } from "@/types/AgendaDocument";
import { Types } from "mongoose";
import { AppointmentDocument } from "@/types/AppointmentDocument";
import Appointment from "@schemas/Appointment";

class AgendaManager extends AbstractManager<AgendaDocument> {
  constructor(userId?: Types.ObjectId) {
    super(Agenda, userId);
  }

  // eslint-disable-next-line class-methods-use-this
  appointments(id: string): Promise<AppointmentDocument[] | null> {
    return Appointment.find({ agendas: new Types.ObjectId(id) }).exec();
  }
}

export default AgendaManager;
