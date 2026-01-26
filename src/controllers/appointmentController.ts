import { matchedData } from "express-validator";
import type { Request, Response } from "express";
import { AppointmentAvailabilitySearch } from "@/types/AppointmentDocument";
import models from "../models/index.js";
import { SlotsFinder } from "@/services/slotsFinder";

const browse = async (req: Request, res: Response) => {
  models.appointment
    .findAll()
    .then((rows) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const read = async (req: Request, res: Response) => {
  models.appointment
    .find(req.params.id)
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

const edit = async (req: Request, res: Response) => {
  const appointment = req.body;

  // TODO validations (length, format...)

  appointment.id = parseInt(req.params.id, 10);

  models.appointment
    .update(appointment)
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

const add = async (req: Request, res: Response) => {
  const appointment = req.body;

  // TODO validations (length, format...)

  models.appointment
    .create(appointment)
    .then((result) => {
      res.location(`/appointments/${result.id}`).sendStatus(201);
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

const destroy = async (req: Request, res: Response) => {
  models.appointment
    .delete(req.params.id)
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

export default {
  browse,
  read,
  edit,
  add,
  destroy,
  search,
};
