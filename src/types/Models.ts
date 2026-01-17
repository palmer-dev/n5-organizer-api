import UserManager from "@models/UserManager";
import AppointmentManager from "@models/AppointmentManager";
import AgendaManager from "@models/AgendaManager";
import WorkScheduleManager from "@models/WorkScheduleManager";
import ExternalAgendaManager from "@models/ExternalAgendaManager";

export interface Models {
  user: UserManager;
  appointment: AppointmentManager;
  agenda: AgendaManager;
  workSchedule: WorkScheduleManager;
  externalAgenda: ExternalAgendaManager;
}
