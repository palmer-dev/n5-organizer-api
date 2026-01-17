import { Types } from "mongoose";
import AppointmentStatusType from "@/types/AppointmentStatusType";
import { TimestampedDocument } from "@/types/TimestampedDocument";

export interface IAppointmentDocument {
  name: string;
  notes: string;
  startDate: Date;
  endDate: Date;
  status?: AppointmentStatusType;
  agendas: Types.ObjectId[];
}

export interface AppointmentDocument
  extends TimestampedDocument,
    IAppointmentDocument {}
