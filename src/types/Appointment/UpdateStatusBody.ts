import AppointmentStatusType from "@/types/AppointmentStatusType";

export interface UpdateStatusBody {
  agendaId: string;
  status: AppointmentStatusType;
}
