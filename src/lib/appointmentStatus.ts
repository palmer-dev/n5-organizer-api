import AppointmentStatusType from "@/types/AppointmentStatusType";
import { AppointmentDocument } from "@/types/AppointmentDocument";
import { Types } from "mongoose";
import { UserDocument } from "@/types/UserDocument";

export function getAppointmentStatus(
  appointment: AppointmentDocument,
  agendaId: Types.ObjectId
) {
  const userAgenda = appointment.agendas.find(
    (agenda) => agenda.agenda === agendaId
  );

  if (userAgenda) {
    return userAgenda.status;
  }

  return AppointmentStatusType.Pending;
}

export function getAppointmentStatusByUser(
  appointment: AppointmentDocument,
  user: string
) {
  const userAgenda = appointment.agendas.find((agenda) => {
    if (agenda.agenda instanceof Types.ObjectId) return false;

    // eslint-disable-next-line no-underscore-dangle
    return agenda.agenda.user?._id.toString() === user;
  });

  if (userAgenda) {
    return userAgenda.status;
  }

  return AppointmentStatusType.Pending;
}
