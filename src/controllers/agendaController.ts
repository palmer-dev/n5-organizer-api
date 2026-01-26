import type { Request, Response } from "express";
import models from "@models/index";
import { AgendaDocument } from "@/types/AgendaDocument";
import { Types } from "mongoose";

const browse = async (req: Request, res: Response) => {
  models
    .forUser(new Types.ObjectId(req.user.id))
    .agenda.findAll()
    .then((rows) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const read = async (req: Request, res: Response) => {
  models
    .forUser(new Types.ObjectId(req.user.id))
    .agenda.find(req.params.id)
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

const getAppointments = async (req: Request, res: Response) => {
  models
    .forUser(new Types.ObjectId(req.user.id))
    .agenda.appointments(req.params.id)
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
  const agenda = req.body as AgendaDocument;

  // TODO validations (length, format...)

  agenda.id = parseInt(req.params.id, 10);

  models
    .forUser(new Types.ObjectId(req.user.id))
    .agenda.update(agenda)
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
  const agenda = req.body;

  // TODO validations (length, format...)

  models
    .forUser(new Types.ObjectId(req.user.id))
    .agenda.create(agenda)
    .then((result) => {
      res.location(`/agendas/${result.id}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const destroy = async (req: Request, res: Response) => {
  models
    .forUser(new Types.ObjectId(req.user.id))
    .agenda.delete(req.params.id)
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
  getAppointments,
  read,
  edit,
  add,
  destroy,
};
