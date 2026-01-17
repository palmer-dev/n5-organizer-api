import type { Request, Response } from "express";
import models from "../models/index.js";

const browse = (req: Request, res: Response) => {
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

const read = (req: Request, res: Response) => {
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

const edit = (req: Request, res: Response) => {
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

const add = (req: Request, res: Response) => {
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

const destroy = (req: Request, res: Response) => {
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
};
