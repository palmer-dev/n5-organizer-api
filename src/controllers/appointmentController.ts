import { matchedData } from "express-validator";
import type { Request, Response } from "express";
import { AppointmentAvailabilitySearch } from "@/types/AppointmentDocument";
import { SlotsFinder } from "@/services/slotsFinder";
import { Types } from "mongoose";
import AppointmentStatusType from "@/types/AppointmentStatusType";
import { AppointmentCreateBody } from "@/types/Appointment/CreateBody";
import { UpdateStatusBody } from "@/types/Appointment/UpdateStatusBody";
import { getAppointmentStatusByUser } from "@lib/appointmentStatus";
import models from "@/models";

const browse = async (req: Request<{ id: string }>, res: Response) => {
  models
    .forUser(new Types.ObjectId(req.user.id))
    .appointment.findAll()
    .then((rows) => {
      res.send(
        rows.map((row) => ({
          ...row,
          status: getAppointmentStatusByUser(row, req.user.id),
        }))
      );
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const read = async (req: Request<{ id: string }>, res: Response) => {
  models
    .forUser(new Types.ObjectId(req.user.id))
    .appointment.find(req.params.id)
    .then((row) => {
      if (row == null) {
        res.sendStatus(404);
      } else {
        res.send(row);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const edit = async (req: Request<{ id: string }>, res: Response) => {
  const appointment = req.body;

  // TODO validations (length, format...)

  appointment.id = new Types.ObjectId(req.params.id);

  models
    .forUser(new Types.ObjectId(req.user.id))
    .appointment.update(appointment)
    .then((result) => {
      if (result === null) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const add = async (
  req: Request<object, object, AppointmentCreateBody>,
  res: Response
) => {
  const appointment = req.body;

  // TODO validations (length, format...)

  const { name, notes, startDate, endDate, users } = appointment;

  const agendas = await models.agenda.findForUsers([
    new Types.ObjectId(req.user.id),
    ...users,
  ]);

  models
    .forUser(new Types.ObjectId(req.user.id))
    .appointment.create({
      name,
      notes,
      startDate,
      endDate,
      agendas: agendas.map((agenda) => ({
        agenda: agenda.id as Types.ObjectId,
        status: AppointmentStatusType.Pending,
      })),
    })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const search = async (req: Request, res: Response) => {
  const searchQuery = matchedData(req);

  try {
    const existingAppointments = await models.appointment.search(
      searchQuery as AppointmentAvailabilitySearch
    );

    const slotFinder = new SlotsFinder(
      2,
      searchQuery.startDate,
      searchQuery.endDate
    );

    slotFinder.setAppointments(existingAppointments);

    const availableSlots = slotFinder.getAvailableSlots();

    // Returns the groupes slots for better visibility on the calendar
    res.send(SlotsFinder.groupSlots(availableSlots));
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const destroy = async (req: Request<{ id: string }>, res: Response) => {
  models
    .forUser(new Types.ObjectId(req.user.id))
    .appointment.delete(req.params.id)
    .then((result) => {
      if (result === null) {
        res.sendStatus(404);
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const updateStatus = async (
  req: Request<{ id: string }, object, UpdateStatusBody>,
  res: Response
) => {
  const { status, agendaId } = req.body;

  models
    .forUser(new Types.ObjectId(req.user.id))
    .appointment.updateAgendaStatus(req.params.id, agendaId, status)
    .then((result) => {
      if (result === null) {
        res.sendStatus(404);
      } else {
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

export default {
  browse,
  read,
  edit,
  add,
  destroy,
  search,
  updateStatus,
};
