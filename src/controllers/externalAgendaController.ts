import type { Request, Response } from "express";
import { Types } from "mongoose";
import models from "../models/index.js";

const browse = async (req: Request, res: Response) => {
  models
    .forUser(new Types.ObjectId(req.user.id))
    .externalAgenda.findAll()
    .then((rows) => {
      res.send(rows);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const read = async (req: Request<{ id: string }>, res: Response) => {
  models
    .forUser(new Types.ObjectId(req.user.id))
    .externalAgenda.find(req.params.id)
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
  const externalAgenda = req.body;

  // TODO validations (length, format...)

  externalAgenda.id = parseInt(req.params.id, 10);

  models
    .forUser(new Types.ObjectId(req.user.id))
    .externalAgenda.update(externalAgenda)
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
  const externalAgenda = req.body;

  // TODO validations (length, format...)

  models
    .forUser(new Types.ObjectId(req.user.id))
    .externalAgenda.create(externalAgenda)
    .then((result) => {
      res.location(`/externalAgendas/${result.id}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const destroy = async (req: Request<{ id: string }>, res: Response) => {
  models
    .forUser(new Types.ObjectId(req.user.id))
    .externalAgenda.delete(req.params.id)
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
