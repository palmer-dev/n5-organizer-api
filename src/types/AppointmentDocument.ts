import { Types } from "mongoose";
import AppointmentStatusType from "@/types/AppointmentStatusType";
import { OwnedDocument } from "@/types/OwnedDocument";
import { AgendaDocument } from "@/types/AgendaDocument";

export interface IAppointmentAgendas {
    agenda: Types.ObjectId | AgendaDocument;
    status: AppointmentStatusType;
}

export interface IAppointmentDocument {
  name: string;
  notes: string;
  startDate: Date;
  endDate: Date;
  agendas: {
    agenda: Types.ObjectId | AgendaDocument;
    status: AppointmentStatusType;
  }[];
}

export interface AppointmentDocument
  extends OwnedDocument,
    IAppointmentDocument {}

export type AppointmentAvailabilitySearch = {
  startDate: Date;
  endDate: Date;
  users: Types.ObjectId[];
  ignoreId?: Types.ObjectId;
};
